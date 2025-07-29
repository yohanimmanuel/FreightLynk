import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle, CheckCircle, Download, Eye } from 'lucide-react';
import { Rate } from '../../../../store/forwarderquote';
import { parseFile, ParsedRow } from '../../../utils/fileParser';
import { mapHeadersFuzzy, saveUserMapping } from '../../../utils/aiHeaderMapper';
import fieldSynonyms from '../../../utils/fieldSynonyms.json';
import { STANDARD_FIELDS } from '../../../utils/standardFields';

// Add a type for mapping info
interface HeaderMappingInfo {
  mappedKey: string | null;
  confidence: number;
  matchedSynonym?: string;
}

// Update ParsedRate type to allow string indexing
interface ParsedRate {
  [key: string]: any;
  id: number;
  mode?: string;
  provider?: string;
  agent?: string;
  origin?: string;
  destination?: string;
  ocean20dc?: string;
  ocean40dc?: string;
  ocean40hc?: string;
  ocean45hc?: string;
  ocean20rf?: string;
  ocean40rf?: string;
  ocean20tank?: string;
  ocean40tank?: string;
  ocean20fr?: string;
  ocean40fr?: string;
  ocean20ot?: string;
  ocean40ot?: string;
  portOfDischarge?: string;
  transitPort?: string;
  remark?: string;
  commodity?: string;
  createdBy?: string;
  validFrom?: string;
  validTo?: string;
  createdOn?: string;
  type?: string;
  createType?: string;
  service?: string;
  serviceCode?: string;
  note?: string;
  contract?: string;
  frequency?: string;
  transitTime?: string;
  currency?: string;
  price?: string;
  baseRate?: string;
  minCharge?: string;
  originAirport?: string;
  destinationAirport?: string;
  airline?: string;
  rate45?: string;
  rate100?: string;
  rate300?: string;
  rate500?: string;
  rate1000?: string;
  truckType?: string;
  rate?: string;
  weight?: string;
  volume?: string;
  carrier?: string;
  incoterm?: string;
  ratePerCbmKg?: string;
  surcharges?: string;
  notes?: string;
  status: 'complete' | 'incomplete' | 'error';
  originalRow: any;
  parsingNotes: string[];
}

// Add a mode prop to RateParser
interface RateParserProps {
  onRatesParsed: (rates: Rate[]) => void;
  onClose: () => void;
  mode?: keyof typeof STANDARD_FIELDS;
}

const RateParser: React.FC<RateParserProps> = ({ onRatesParsed, onClose, mode = 'FCL' }) => {
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

  // Use the standard fields for the selected mode
  const standardFields = STANDARD_FIELDS[mode];

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
      // Debug log: print headers and first row
      console.log('DEBUG: Parsed headers:', headers);
      console.log('DEBUG: First parsed row:', data[0]);
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
      // No required field checks, all fields are optional
      const norm: Record<string, any> = {};
      for (const [header, stdKey] of Object.entries(mapping)) {
        if (stdKey) {
          const normalizedHeader = header.trim().toLowerCase();
          const normalizedStdKey = stdKey.trim(); // preserve camelCase
          const actualKey = Object.keys(row).find(k => k.trim().toLowerCase() === normalizedHeader);
          if (actualKey) {
            norm[normalizedStdKey] = row[actualKey];
          }
        }
      }
      rates.push({
        ...norm,
        id: index,
        status: 'complete', // Always mark as complete
        parsingNotes: [],
        originalRow: row,
        ...Object.fromEntries(standardFields.map(field => [field.key, norm[field.key] || '']))
      } as ParsedRate);
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
    // Convert user input to standardized tab modes
    let standardizedMode = parsedRate.mode || mode;
    
    // Map common mode variations to standardized tab modes
    const modeMapping: Record<string, string> = {
      // Ocean/FCL variations
      'OCEAN': 'FCL',
      'OCEAN FREIGHT': 'FCL',
      'FULL CONTAINER': 'FCL',
      'FULL CONTAINER LOAD': 'FCL',
      'FCL': 'FCL',
      'FULL': 'FCL',
      
      // LCL variations
      'LCL': 'LCL',
      'LESS THAN CONTAINER': 'LCL',
      'LESS THAN CONTAINER LOAD': 'LCL',
      'PARTIAL': 'LCL',
      'LESS': 'LCL',
      
      // Air variations
      'AIR': 'AIR',
      'AIR FREIGHT': 'AIR',
      'AIR CARGO': 'AIR',
      'AIRPLANE': 'AIR',
      'AIRCRAFT': 'AIR',
      
      // FTL variations
      'FTL': 'FTL',
      'FULL TRUCK': 'FTL',
      'FULL TRUCKLOAD': 'FTL',
      'TRUCK FULL': 'FTL',
      
      // LTL variations
      'LTL': 'LTL',
      'LESS THAN TRUCK': 'LTL',
      'LESS THAN TRUCKLOAD': 'LTL',
      'TRUCK PARTIAL': 'LTL'
    };
    
    // Convert to uppercase for comparison and map to standardized mode
    const upperMode = standardizedMode.toUpperCase();
    standardizedMode = modeMapping[upperMode] || mode; // fallback to current tab mode
    
    return {
      id: typeof parsedRate.id === 'number' ? parsedRate.id : Date.now(),
      mode: standardizedMode,
      provider: parsedRate.provider || '',
      agent: parsedRate.agent || '',
      origin: parsedRate.origin || '',
      destination: parsedRate.destination || '',
      ocean20dc: parsedRate.ocean20dc || '',
      ocean40dc: parsedRate.ocean40dc || '',
      ocean40hc: parsedRate.ocean40hc || '',
      ocean45hc: parsedRate.ocean45hc || '',
      ocean20rf: parsedRate.ocean20rf || '',
      ocean40rf: parsedRate.ocean40rf || '',
      ocean20tank: parsedRate.ocean20tank || '',
      ocean40tank: parsedRate.ocean40tank || '',
      ocean20fr: parsedRate.ocean20fr || '',
      ocean40fr: parsedRate.ocean40fr || '',
      ocean20ot: parsedRate.ocean20ot || '',
      ocean40ot: parsedRate.ocean40ot || '',
      portOfDischarge: parsedRate.portOfDischarge || '',
      transitPort: parsedRate.transitPort || '',
      remark: parsedRate.remark || '',
      commodity: parsedRate.commodity || '',
      createdBy: parsedRate.createdBy || '',
      validFrom: parsedRate.validFrom || '',
      validTo: parsedRate.validTo || '',
      createdOn: parsedRate.createdOn || '',
      type: parsedRate.type || '',
      createType: parsedRate.createType || '',
      service: parsedRate.service || '',
      serviceCode: parsedRate.serviceCode || '',
      note: parsedRate.note || '',
      contract: parsedRate.contract || '',
      frequency: parsedRate.frequency || '',
      transitTime: parsedRate.transitTime || '',
      currency: parsedRate.currency || '',
      price: parsedRate.price || '',
      baseRate: parsedRate.baseRate || '',
      minCharge: parsedRate.minCharge || '',
      originAirport: parsedRate.originAirport || '',
      destinationAirport: parsedRate.destinationAirport || '',
      airline: parsedRate.airline || '',
      rate45: parsedRate.rate45 || '',
      rate100: parsedRate.rate100 || '',
      rate300: parsedRate.rate300 || '',
      rate500: parsedRate.rate500 || '',
      rate1000: parsedRate.rate1000 || '',
      truckType: parsedRate.truckType || '',
      rate: parsedRate.rate || '',
      status: parsedRate.status || '',
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
                <td className="px-4 py-2 text-xs text-gray-900">
                  {headerMappingInfo[header]?.confidence !== undefined ? (headerMappingInfo[header].confidence * 100).toFixed(0) + '%' : '-'}
                </td>
                <td className="px-4 py-2 text-xs text-gray-900">
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

  // Remove required field checks in UI
  const missingRequiredMapping = false;
  const missingRequiredInPreview = false;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Import {mode} Rates</h2>
              <p className="mb-4 text-sm text-gray-700">Map your columns to the required fields for {mode}. Required fields are marked with *.</p>
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
                        <table className="min-w-full divide-y divide-gray-200 text-xs mt-4">
                          <thead className="bg-gray-50">
                            <tr>
                              {standardFields.map(field => (
                                <th key={field.key} className="px-4 py-2 text-left font-medium text-gray-500 uppercase whitespace-nowrap">{field.label}{field.required && <span className="text-red-500">*</span>}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {parsedRates.length === 0 ? (
                              <tr><td colSpan={standardFields.length} className="text-center py-8 text-gray-400">No preview data.</td></tr>
                            ) : parsedRates.map((row, idx) => (
                              <tr key={idx}>
                                {standardFields.map(field => (
                                  <td key={field.key} className={`px-4 py-4 text-gray-900 whitespace-nowrap ${field.required && !row[field.key] ? 'bg-red-50 text-red-500' : ''}`}>{row[field.key] || (field.required ? <span className="text-xs">Missing</span> : '')}</td>
                                ))}
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
                        disabled={false}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-md bg-[#007bff] hover:bg-blue-700`}
                      >
                        Import Rates
                      </button>
                    </div>
                  </div>
                  {missingRequiredMapping && <div className="text-red-500 text-xs mt-2">Please map all required fields before importing.</div>}
                  {!missingRequiredMapping && missingRequiredInPreview && <div className="text-red-500 text-xs mt-2">Some required fields are missing in your data. Please review the preview table.</div>}
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