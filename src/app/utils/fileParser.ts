import * as XLSX from 'xlsx';

// Utility functions for parsing different file formats

export interface ParsedRow {
  [key: string]: string | number;
}

export const parseCSV = (text: string): ParsedRow[] => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data: ParsedRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: ParsedRow = {};
    
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    
    data.push(row);
  }

  return data;
};

function findTableBlocks(rows: any[][]) {
  let blocks: {rows: any[][], start: number, end: number}[] = [];
  let currentBlock: any[][] = [];
  let blockStart = -1;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].some(cell => String(cell).trim())) {
      if (currentBlock.length === 0) blockStart = i;
      currentBlock.push(rows[i]);
    } else if (currentBlock.length) {
      blocks.push({ rows: currentBlock, start: blockStart, end: i - 1 });
      currentBlock = [];
      blockStart = -1;
    }
  }
  if (currentBlock.length) blocks.push({ rows: currentBlock, start: blockStart, end: rows.length - 1 });
  return blocks;
}

export const parseFile = async (file: File): Promise<ParsedRow[]> => {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'csv') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const data = parseCSV(text);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  } else if (['xlsx', 'xls'].includes(extension || '')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target!.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Get all rows as arrays
          const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

          // Find all contiguous non-empty blocks
          const blocks = findTableBlocks(rows);
          // Pick the largest block (most rows * columns)
          const mainBlock = blocks.sort((a, b) => (b.rows.length * (b.rows[0]?.length || 0)) - (a.rows.length * (a.rows[0]?.length || 0)))[0];
          if (!mainBlock) throw new Error('No table found in sheet');

          const headers = mainBlock.rows[0].map((h: any) => String(h).trim());
          const dataRows = mainBlock.rows.slice(1);

          // Convert to array of objects
          const json: ParsedRow[] = dataRows.map(row => {
            const obj: ParsedRow = {};
            headers.forEach((header, i) => {
              obj[header] = row[i] ?? '';
            });
            return obj;
          });

          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  } else {
    throw new Error('Unsupported file format. Please upload a CSV or Excel file.');
  }
};

// Field mapping utilities
export const findMatchingField = (headers: string[], targetFields: string[]): string | null => {
  for (const header of headers) {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, ' ');
    for (const target of targetFields) {
      if (normalizedHeader.includes(target.toLowerCase())) {
        return header;
      }
    }
  }
  return null;
};

// Pattern matching utilities
export const modePatterns = {
  ocean: ['ocean', 'sea', 'maritime', 'vessel', 'ship', 'container', 'fcl', 'lcl'],
  air: ['air', 'airfreight', 'air cargo', 'airline', 'flight'],
  truck: ['truck', 'road', 'land', 'ground', 'ftl', 'ltl', 'trucking']
};

export const shipmentTypePatterns = {
  FCL: ['fcl', 'full container', 'full container load', 'container', '20ft', '40ft'],
  LCL: ['lcl', 'less than container', 'consolidated', 'groupage'],
  FTL: ['ftl', 'full truck', 'full truck load', 'truck load'],
  LTL: ['ltl', 'less than truck', 'partial truck', 'part load']
};

export const detectMode = (text: string): 'ocean' | 'air' | 'truck' => {
  const normalized = text.toLowerCase();
  for (const [mode, patterns] of Object.entries(modePatterns)) {
    if (patterns.some(pattern => normalized.includes(pattern))) {
      return mode as 'ocean' | 'air' | 'truck';
    }
  }
  return 'ocean'; // default
};

export const detectShipmentType = (text: string, mode: string): 'FCL' | 'LCL' | 'FTL' | 'LTL' => {
  const normalized = text.toLowerCase();
  
  // Check for explicit shipment type patterns
  for (const [type, patterns] of Object.entries(shipmentTypePatterns)) {
    if (patterns.some(pattern => normalized.includes(pattern))) {
      return type as 'FCL' | 'LCL' | 'FTL' | 'LTL';
    }
  }

  // Default based on mode
  if (mode === 'air') return 'LCL';
  if (mode === 'truck') return 'FTL';
  return 'FCL';
};

export const extractRange = (text: string): { min?: string; max?: string } => {
  if (!text) return {};
  
  const rangeMatch = text.match(/(\d+(?:\.\d+)?)\s*[-–—]\s*(\d+(?:\.\d+)?)/);
  if (rangeMatch) {
    return { min: rangeMatch[1], max: rangeMatch[2] };
  }
  
  const singleMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (singleMatch) {
    return { min: singleMatch[1] };
  }
  
  return {};
};

export const extractCurrency = (text: string): string => {
  const currencyMatch = text.match(/(USD|EUR|GBP|CNY|SGD|JPY|AUD|CAD)/i);
  return currencyMatch ? currencyMatch[1].toUpperCase() : 'USD';
}; 