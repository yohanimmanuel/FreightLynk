import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import { Rate } from '../../../../store/quoterate';
import { parseFile, ParsedRow } from '../../../utils/fileParser';
import { mapHeadersFuzzy, saveUserMapping } from '../../../utils/aiHeaderMapper';
import fieldSynonyms from '../../../utils/fieldSynonyms.json';
import { standardFields as rawStandardFields } from '../../../utils/standardFields';

// Add a type for standardFields
interface StandardField {
  key: string;
  label: string;
  visible?: boolean;
}
const standardFields = rawStandardFields as StandardField[];

// Add a type for mapping info
interface HeaderMappingInfo {
  mappedKey: string | null;
  confidence: number;
  matchedSynonym?: string;
}

interface ParsedRate {
  id: number;
  originCity: string;
  destinationCity: string;
  mode: 'ocean' | 'air' | 'road';
  shipmentType: 'FCL' | 'LCL' | 'FTL' | 'LTL';
  containertype: string;
  baseRate: number;
  price: string;
  currency: string;
  weight: string;
  volume: string;
  carrier: string;
  transitTime: string;
  incoterm?: string;
  validFrom: string;
  validTo: string;
  ratePerCbmKg?: string;
  surcharges?: string;
  notes?: string;
  status: 'complete' | 'incomplete' | 'error';
  originalRow: any;
  parsingNotes: string[];
}

interface RateParserProps {
  onRatesParsed: (rates: Rate[]) => void;
  onClose: () => void;
}

function excelDateToJSDate(serial: number): string {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return date_info.toISOString().split('T')[0];
}

const RateParser: React.FC<RateParserProps> = ({ onRatesParsed, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedRates, setParsedRates] = useState<ParsedRate[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<Record<string, string | null>>({});
  const [headerMappingInfo, setHeaderMappingInfo] = useState<Record<string, HeaderMappingInfo>>({});
  const [mappingConfirmed, setMappingConfirmed] = useState(false);
  const [rawData, setRawData] = useState<ParsedRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Accept Excel, CSV only
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert('Please upload a supported file: Excel (.xlsx, .xls) or CSV');
      return;
    }

    setUploadedFile(file);
    setIsParsing(true);

    try {
      // Artificial delay for AI effect
      await new Promise(res => setTimeout(res, 1200));

      const data = await parseFile(file);
      if (!data.length) throw new Error('No data found');
      const headers = Object.keys(data[0]);
      setDetectedHeaders(headers);
      // Get mapping info with confidence
      const mappingInfo: Record<string, HeaderMappingInfo> = {};
      headers.forEach(header => {
        let bestKey: string | null = null;
        let bestScore = 0.7;
        let matchedSynonym = '';
        for (const [key, synonyms] of Object.entries(fieldSynonyms)) {
          for (const synonym of synonyms) {
            if (header.toLowerCase() === synonym.toLowerCase()) {
              bestKey = key;
              bestScore = 1;
              matchedSynonym = synonym;
              break;
            }
            // Fuzzy
            const dist = levenshtein(header.toLowerCase(), synonym.toLowerCase());
            const maxLen = Math.max(header.length, synonym.length);
            const score = maxLen === 0 ? 1 : 1 - dist / maxLen;
            if (score > bestScore) {
              bestScore = score;
              bestKey = key;
              matchedSynonym = synonym;
            }
          }
        }
        mappingInfo[header] = { mappedKey: bestKey, confidence: bestScore, matchedSynonym };
      });
      setHeaderMappingInfo(mappingInfo);
      // For backward compatibility
      setHeaderMapping(Object.fromEntries(headers.map(h => [h, mappingInfo[h].mappedKey])));
      setRawData(data);
      setMappingConfirmed(false);
      setParsedRates([]); // Clear previous parse
    } catch (error) {
      console.error('Error parsing file:', error);
      alert('Error parsing file. Please check the file format.');
    } finally {
      setIsParsing(false);
    }
  };

  // Fuzzy row parsing using header mapping
  const parseRatesFuzzy = (data: ParsedRow[], mapping: Record<string, string | null>): ParsedRate[] => {
    if (data.length === 0) return [];
    const rates: ParsedRate[] = [];
    data.forEach((row, index) => {
      const parsingNotes: string[] = [];
      let status: 'complete' | 'incomplete' | 'error' = 'complete';
      // Build a normalized row using the mapping
      const norm: Record<string, any> = {};
      for (const [header, stdKey] of Object.entries(mapping)) {
        if (stdKey) norm[stdKey] = row[header];
      }
      // Required fields
      const originCity = norm.originCity ? String(norm.originCity) : '';
      const destinationCity = norm.destinationCity ? String(norm.destinationCity) : '';
      const rawMode = norm.mode ? String(norm.mode) : '';
      const rawRate = norm.baseRate ? String(norm.baseRate) : '';
      const carrier = norm.carrier ? String(norm.carrier) : '';
      // Mode/type detection
      const mode = rawMode.toLowerCase().includes('sea') ? 'ocean' : rawMode.toLowerCase().includes('air') ? 'air' : rawMode.toLowerCase().includes('truck') ? 'road' : 'ocean';
      const shipmentType = norm.shipmentType ? String(norm.shipmentType).toUpperCase() as ParsedRate['shipmentType'] : (mode === 'air' ? 'LCL' : 'FCL');
      // Rate parsing
      const rateInfo = /([\d,.]+)(?:\s*\/\s*(kg|cbm|container|ftl|ltl))?/i.exec(rawRate);
      let baseRate = 0;
      let ratePerCbmKg = '';
      if (rateInfo) {
        baseRate = parseFloat(rateInfo[1].replace(',', '.'));
        if (rateInfo[2]) ratePerCbmKg = rateInfo[1] + '/' + rateInfo[2];
      }
      // Currency
      const currency = norm.currency ? String(norm.currency).toUpperCase() : (rawRate.includes('USD') ? 'USD' : 'USD');
      // Weight/volume (combine min/max/unit if available)
      let weight = '';
      if (norm.weightMin && norm.weightMax && norm.weightUnit) {
        weight = `${norm.weightMin} ${norm.weightUnit} - ${norm.weightMax} ${norm.weightUnit}`;
      } else if (norm.weightMin && norm.weightUnit) {
        weight = `${norm.weightMin} ${norm.weightUnit}`;
      } else if (norm.weightMax && norm.weightUnit) {
        weight = `${norm.weightMax} ${norm.weightUnit}`;
      } else if (norm.weight) {
        weight = String(norm.weight);
      }
      let volume = '';
      if (norm.volumeMin && norm.volumeMax && norm.volumeUnit) {
        volume = `${norm.volumeMin} ${norm.volumeUnit} - ${norm.volumeMax} ${norm.volumeUnit}`;
      } else if (norm.volumeMin && norm.volumeUnit) {
        volume = `${norm.volumeMin} ${norm.volumeUnit}`;
      } else if (norm.volumeMax && norm.volumeUnit) {
        volume = `${norm.volumeMax} ${norm.volumeUnit}`;
      } else if (norm.volume) {
        volume = String(norm.volume);
      }
      // Dates
      const validFrom = typeof norm.validFrom === 'number' && norm.validFrom > 30000 && norm.validFrom < 60000
        ? excelDateToJSDate(norm.validFrom)
        : String(norm.validFrom);
      const validTo = typeof norm.validTo === 'number' && norm.validTo > 30000 && norm.validTo < 60000
        ? excelDateToJSDate(norm.validTo)
        : String(norm.validTo);
      // Surcharges/notes
      const surcharges = norm.surcharges ? String(norm.surcharges) : '';
      const notes = norm.notes ? String(norm.notes) : '';
      // Transit time
      const transitTime = norm.transitTime ? String(norm.transitTime) : '';
      // Container/road type
      const containertype = norm.containertype ? String(norm.containertype) : (shipmentType === 'FCL' ? '20ft' : shipmentType === 'FTL' ? 'Road' : 'none');
      // Incoterm
      const incoterm = norm.incoterm ? String(norm.incoterm) : '';
      // Validate completeness
      if (!originCity || !destinationCity || !carrier) {
        status = 'incomplete';
        parsingNotes.push('Missing required fields (origin, destination, or carrier)');
      }
      if (!rawRate) {
        status = 'incomplete';
        parsingNotes.push('Missing rate information');
      }
      const parsedRate: ParsedRate = {
        id: index + 1,
        originCity: originCity || 'Missing Value',
        destinationCity: destinationCity || 'Missing Value',
        mode,
        shipmentType,
        containertype,
        baseRate,
        price: rawRate || 'Missing Value',
        currency,
        weight: weight || 'Missing Value',
        volume: volume || 'Missing Value',
        carrier: carrier || 'Missing Value',
        transitTime: transitTime || 'Missing Value',
        incoterm,
        validFrom: validFrom || '',
        validTo: validTo || '',
        ratePerCbmKg,
        surcharges,
        notes,
        status,
        originalRow: row,
        parsingNotes
      };
      rates.push(parsedRate);
    });
    return rates;
  };

  // Handler for confirming mapping
  const handleConfirmMapping = () => {
    if (!rawData.length) return;
    const parsed = parseRatesFuzzy(rawData, headerMapping);
    setParsedRates(parsed);
    setMappingConfirmed(true);
  };

  // Handler for changing mapping
  const handleMappingChange = (header: string, value: string) => {
    setHeaderMapping(prev => ({ ...prev, [header]: value === 'ignore' ? null : value }));
    setHeaderMappingInfo(prev => ({
      ...prev,
      [header]: {
        ...prev[header],
        mappedKey: value === 'ignore' ? null : value,
        confidence: value === 'ignore' ? 0 : 1,
        matchedSynonym: value === 'ignore' ? '' : prev[header].matchedSynonym
      }
    }));
    if (value !== 'ignore') saveUserMapping(header, value);
  };

  const convertToRateFormat = (parsedRate: ParsedRate): Rate => {
    return {
      id: Date.now() + parsedRate.id,
      lane: `${parsedRate.originCity} - ${parsedRate.destinationCity}`,
      mode: parsedRate.mode,
      shipmentType: parsedRate.shipmentType,
      weight: parsedRate.weight,
      volume: parsedRate.volume,
      containertype: parsedRate.containertype,
      currency: parsedRate.currency,
      price: parsedRate.price,
      baseRate: parsedRate.baseRate,
      originCity: parsedRate.originCity,
      destinationCity: parsedRate.destinationCity,
      transitTime: parsedRate.transitTime,
      carrier: parsedRate.carrier,
      surcharges: parsedRate.surcharges || '',
      incoterm: parsedRate.incoterm || 'FOB',
      validFrom: parsedRate.validFrom,
      validTo: parsedRate.validTo,
      notes: parsedRate.parsingNotes.join('; ') || '',
      status: parsedRate.status === 'complete' ? 'draft' : 'incomplete',
      ratePerCbmKg: parsedRate.ratePerCbmKg || '',
    };
  };

  const handleImportRates = () => {
    // Import ALL parsed rates, not just complete ones
    const allRates = parsedRates.map(convertToRateFormat);
    onRatesParsed(allRates);
    onClose();
  };

  const handleExportParsed = () => {
    const dataStr = JSON.stringify(parsedRates, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'parsed_rates.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  // UI for mapping confirmation
  const renderMappingTable = () => (
    <div>
      <h4 className="text-md text-gray-900 font-semibold mb-2 flex items-center gap-2">
        Confirm Header Mapping
        <span className="ml-2 text-xs text-gray-500 cursor-pointer" title="How does mapping work?">
          <a href="https://github.com/yourrepo/docs#field-mapping" target="_blank" rel="noopener noreferrer">[?]</a>
        </span>
      </h4>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">File Header</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Map To</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Matched Synonym</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {detectedHeaders.map(header => (
              <tr key={header}>
                <td className="px-4 py-2 text-xs text-gray-900">{header}</td>
                <td className="px-4 py-2">
                  <select
                    className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-900"
                    value={headerMapping[header] || 'ignore'}
                    onChange={e => handleMappingChange(header, e.target.value)}
                  >
                    <option value="ignore">Ignore</option>
                    {standardFields.map(f => (
                      <option key={f.key + f.label} value={f.key}>{f.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-xs">
                  {headerMappingInfo[header]?.confidence !== undefined ? (headerMappingInfo[header].confidence * 100).toFixed(0) + '%' : '-'}
                </td>
                <td className="px-4 py-2 text-xs">
                  {headerMappingInfo[header]?.matchedSynonym || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        <b>Tip:</b> If a mapping is incorrect, select the correct field. Your correction will be remembered for future uploads.<br/>
        To add new synonyms, update <code>fieldSynonyms.json</code> in the codebase.
      </div>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-semibold"
        onClick={handleConfirmMapping}
      >
        Confirm Mapping
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Rate Parser</h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload CSV or Excel files to automatically parse freight rates
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          {!uploadedFile ? (
            // File Upload Section
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Upload Rate Sheet
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag and drop your <b>Excel or CSV</b> file here, or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#007bff] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="text-xs text-gray-500 mt-3">
                Supported formats: Excel (.xlsx, .xls), CSV
              </div>
            </div>
          ) : (
            // Parsing Results Section
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900">{uploadedFile.name}</span>
                  <span className="text-sm text-gray-500">
                    ({parsedRates.length} rates parsed)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                    {previewMode ? 'Hide' : 'Show'} Preview
                  </button>
                  <button
                    onClick={handleExportParsed}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Download className="w-4 h-4" />
                    Export JSON
                  </button>
                </div>
              </div>

              {isParsing && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-semibold animate-pulse" style={{ fontSize: '1.15rem' }}>
                    Analyzing with AI...
                  </p>
                  <p className="text-xs text-gray-400 mt-2 animate-pulse">This may take a few seconds</p>
                </div>
              )}

              {!isParsing && !mappingConfirmed && detectedHeaders.length > 0 && (
                renderMappingTable()
              )}

              {!isParsing && mappingConfirmed && parsedRates.length > 0 && (
                <div className="space-y-4">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {parsedRates.filter(r => r.status === 'complete').length}
                      </div>
                      <div className="text-sm text-green-700">Complete</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {parsedRates.filter(r => r.status === 'incomplete').length}
                      </div>
                      <div className="text-sm text-yellow-700">Incomplete</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {parsedRates.filter(r => r.status === 'error').length}
                      </div>
                      <div className="text-sm text-red-700">Errors</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {parsedRates.length}
                      </div>
                      <div className="text-sm text-blue-700">Total</div>
                    </div>
                  </div>

                  {/* Preview Table */}
                  {previewMode && (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origin</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrier</th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {parsedRates.slice(0, 10).map((rate) => (
                              <tr key={rate.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3">
                                  {rate.status === 'complete' ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : rate.status === 'incomplete' ? (
                                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                                  ) : (
                                    <X className="w-4 h-4 text-red-500" />
                                  )}
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-900">{rate.originCity}</td>
                                <td className="px-4 py-3 text-xs text-gray-900">{rate.destinationCity}</td>
                                <td className="px-4 py-3 text-xs text-gray-900 capitalize">{rate.mode}</td>
                                <td className="px-4 py-3 text-xs text-gray-900">{rate.shipmentType}</td>
                                <td className="px-4 py-3 text-xs text-gray-900">{rate.currency} {rate.baseRate}</td>
                                <td className="px-4 py-3 text-xs text-gray-900">{rate.carrier}</td>
                                <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">
                                  {rate.parsingNotes.join(', ')}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {parsedRates.length > 10 && (
                        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
                          Showing first 10 of {parsedRates.length} rates
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setParsedRates([]);
                        setDetectedHeaders([]);
                        setHeaderMapping({});
                        setHeaderMappingInfo({});
                        setMappingConfirmed(false);
                        setRawData([]);
                      }}
                      className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Upload Another File
                    </button>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleImportRates}
                        disabled={parsedRates.filter(r => r.status === 'complete').length === 0}
                        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Import {parsedRates.length} Rates
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateParser; 

// Add Levenshtein for local fuzzy in this file
function levenshtein(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return matrix[a.length][b.length];
} 