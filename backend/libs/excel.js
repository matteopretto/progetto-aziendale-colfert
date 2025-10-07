import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------ Excel
// ------------------------------------------------------------------------------------------------------------------------------------------------------------


// npm install exceljs


/*
DeleteFormatting() // all formatting
Border(cell, color, thickness = 1)
Align(horizontal, vertical)
Background(color)
Foreground(color)
Font(fontname, size, bold, italic, underline, strikethrough)
*/



export class ExcelWrapper 
{
    constructor(filePath) {
        this.filePath = filePath;
        this.workbook = new ExcelJS.Workbook();
        this.fileExists = fs.existsSync(filePath);
        this.currentWorksheet = null;
    }

    async load() {
        if (this.fileExists) {
            await this.workbook.xlsx.readFile(this.filePath);
        }
    }

    async save() {
        await this.workbook.xlsx.writeFile(this.filePath);
    }

    async saveTo(filePath) {
        await this.workbook.xlsx.writeFile(filePath);
    }

    addWorksheet(name) {
        this.workbook.addWorksheet(name);
        this.currentWorksheet = this.workbook.getWorksheet(name);
    }

    deleteWorksheet(name) {
        this.workbook.removeWorksheet(name);
    }

    chooseWorksheet(name) {
        this.currentWorksheet = this.workbook.getWorksheet(name);
    }

    chooseWorksheetByIndex(index) {
        this.currentWorksheet = this.workbook.worksheets[index] || null;
    }

    getWorksheetNames() {
        return this.workbook.worksheets.map(sheet => sheet.name);
    }


    async set(cell, type, value) {
      if (!this.currentWorksheet) {
          throw new Error("Nessun worksheet selezionato. Usa chooseWorksheet(nome) prima di impostare i dati.");
      }

      await this.setByCoords(cell.row, cell.col, type, value);
  }

  async setByCoords(row, col, type, value) {
      if (!this.currentWorksheet) {
          throw new Error("Nessun worksheet selezionato. Usa chooseWorksheet(nome) prima di impostare i dati.");
      }

      const cell = this.currentWorksheet.getCell(row, col);
      switch (type) {
          case 's':
              cell.value = String(value);
              cell.numFmt = '@';
              break;
          case 'u':
              cell.value = { formula: value };
              break;
          case 'f':
          case 'q':
              cell.value = parseFloat(value);
              break;
          case 'd':
              cell.value = new Date(value);
              break;
          case 'b':
              cell.value = Boolean(value);
              break;
          case 'i':
              cell.value = parseInt(value, 10);
              break;
          case 'a':
              cell.value = parseFloat(value);
              cell.numFmt = '€#,##0.00';
              break;
          case 't':
              cell.value = new Date(value);
              cell.numFmt = 'hh:mm:ss';
              break;
          default:
              throw new Error("Tipo non riconosciuto: " + type);
      }
  }



    async setHyperlink(cell, text, link) {
        if (!this.currentWorksheet) return;
        const targetCell = this.currentWorksheet.getCell(cell);
        targetCell.value = { text, hyperlink: link };
        targetCell.font = { color: { argb: '0563C1' }, underline: true };
    }

    async deleteFormatting(cell) {
        if (!this.currentWorksheet) return;
        this.currentWorksheet.getCell(cell).style = {};
    }

    async border(cell, color, thickness = 1) {
        if (!this.currentWorksheet) return;
        this.currentWorksheet.getCell(cell).border = {
            top: { style: 'thin', color: { argb: color } },
            left: { style: 'thin', color: { argb: color } },
            bottom: { style: 'thin', color: { argb: color } },
            right: { style: 'thin', color: { argb: color } }
        };
    }

    async align(cell, horizontal, vertical) {
        if (!this.currentWorksheet) return;
        this.currentWorksheet.getCell(cell).alignment = { horizontal, vertical };
    }

    async background(cell, color) {
        if (!this.currentWorksheet) return;
        this.currentWorksheet.getCell(cell).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
        };
    }

    async foreground(cell, color) {
        if (!this.currentWorksheet) return;
        this.currentWorksheet.getCell(cell).font = {
            color: { argb: color }
        };
    }

    async font(cell, fontname, size, bold, italic, underline, strikethrough) {
        if (!this.currentWorksheet) return;
        this.currentWorksheet.getCell(cell).font = {
            name: fontname,
            size: size,
            bold: bold,
            italic: italic,
            underline: underline,
            strike: strikethrough
        };
    }

    async setImage(cell, imagePath) {
        if (!this.currentWorksheet) return;
        const imageId = this.workbook.addImage({
            filename: imagePath,
            extension: path.extname(imagePath).substring(1),
        });
        const { row, col } = this.currentWorksheet.getCell(cell);
        this.currentWorksheet.addImage(imageId, {
            tl: { col: col - 1, row: row - 1 },
            ext: { width: 100, height: 100 },
        });
    }

    async autoResize(column) {
        if (!this.currentWorksheet) return;
        const col = this.currentWorksheet.getColumn(column);
        col.width = Math.max(...col.values.map(val => (val ? val.toString().length : 10))) + 2;
    }

    async autoResizeSheet() {
      if (!this.currentWorksheet) return;
      this.currentWorksheet.columns.forEach((col) => {
          let maxLength = 10;
          col.eachCell((cell) => {
              if (cell.value) {
                  const cellText = cell.value.toString();
                  maxLength = Math.max(maxLength, cellText.length);
              }
          });
          col.width = maxLength + 2;
      });
  }


    async export(datas) {
        if (!this.currentWorksheet) {
            throw new Error("Nessun worksheet selezionato. Usa chooseWorksheet(nome) prima di esportare i dati.");
        }
        if (!Array.isArray(datas) || datas.length === 0) {
            throw new Error("Il vettore di dati è vuoto o non è un array valido.");
        }
        const headers = Object.keys(datas[0]);
        for (let index = 0; index < headers.length; index++) {
            const cell = this.currentWorksheet.getCell(1, index + 1);
            cell.value = headers[index];
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
            cell.font = { bold: true };
        }
        for (let rowIndex = 0; rowIndex < datas.length; rowIndex++) {
            for (let colIndex = 0; colIndex < headers.length; colIndex++) {
                this.currentWorksheet.getCell(rowIndex + 2, colIndex + 1).value = datas[rowIndex][headers[colIndex]];
            }
        }
        await this.freeze(1, 0);
        await this.autoResizeSheet();
    }
/*
    async exportTyped(datas, types) {
      if (!this.currentWorksheet) {
          throw new Error("Nessun worksheet selezionato. Usa chooseWorksheet(nome) prima di esportare i dati.");
      }

      if (!Array.isArray(datas) || datas.length === 0) {
          throw new Error("Il vettore di dati è vuoto o non è un array valido.");
      }

      if (typeof types !== 'string' || types.length !== Object.keys(datas[0]).length) {
          throw new Error("La stringa dei tipi non è valida o non corrisponde al numero di colonne.");
      }

      const headers = Object.keys(datas[0]);
      for (let index = 0; index < headers.length; index++) {
          const cell = this.currentWorksheet.getCell(1, index + 1);
          cell.value = headers[index];
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
          cell.font = { bold: true };
      }

      for (let rowIndex = 0; rowIndex < datas.length; rowIndex++) {
          for (let colIndex = 0; colIndex < headers.length; colIndex++) {
              await this.setByCoords(rowIndex + 2, colIndex + 1, types[colIndex], datas[rowIndex][headers[colIndex]]);
          }
      }

      await this.freeze(1, 0);
      await this.autoResizeSheet();
  }
*/

async exportTyped(datas, types) {
  if (!this.currentWorksheet) {
      throw new Error("Nessun worksheet selezionato. Usa chooseWorksheet(nome) prima di esportare i dati.");
  }

  if (!Array.isArray(datas) || datas.length === 0) {
      throw new Error("Il vettore di dati è vuoto o non è un array valido.");
  }

  if (typeof types !== 'string' || types.length !== Object.keys(datas[0]).length) {
      throw new Error("La stringa dei tipi non è valida o non corrisponde al numero di colonne.");
  }

  const headers = Object.keys(datas[0]);
//  console.log("Headers trovati:", headers);

  // Scrive gli headers
  for (let index = 0; index < headers.length; index++) {
      const cell = this.currentWorksheet.getCell(1, index + 1);
//      console.log(`Scrivendo header ${headers[index]} in cella (1, ${index + 1})`);
      cell.value = headers[index];
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC107' } };
      cell.font = { bold: true };
  }

  // Scrive i dati con `await`
  for (let rowIndex = 0; rowIndex < datas.length; rowIndex++) {
      for (let colIndex = 0; colIndex < headers.length; colIndex++) {
//          console.log(`Scrivendo valore ${datas[rowIndex][headers[colIndex]]} in cella (${rowIndex + 2}, ${colIndex + 1}) con tipo ${types[colIndex]}`);
          this.currentWorksheet.getCell(rowIndex + 2, colIndex + 1).value = datas[rowIndex][headers[colIndex]];
      }
  }

  await this.freeze(1, 0);
  await this.autoResizeSheet();
}




  async freeze(row, column) {
      if (!this.currentWorksheet) return;
      this.currentWorksheet.views = [{ state: 'frozen', xSplit: column, ySplit: row }];
  }




}



if (typeof globalThis !== 'undefined') { globalThis.Excel = ExcelWrapper; }

