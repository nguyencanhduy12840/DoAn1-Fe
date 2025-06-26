import { useEffect, useMemo, useRef, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { saveInventory } from "../../../services/api";

const InventoryTable = () => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;
  });

  interface InventoryItem {
    productEntity: {
      name: string;
    };
    beginningInventory: number;
    totalImported: number;
    totalSold: number;
    endingInventory: number;
  }

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const isFirstRender = useRef(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return inventory.slice(indexOfFirstItem, indexOfLastItem);
  }, [inventory, currentPage]);
  const totalPages = Math.ceil(inventory.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [inventory]);
  const handleGetInventory = async () => {
    try {
      const [year, month] = selectedDate.split("-");
      const res = await saveInventory(+month, +year);
      console.log(res.data.details);
      setInventory(res.data.details);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      handleGetInventory();
    }
  }, []);

  console.log(currentItems);

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Inventory Report");

    worksheet.mergeCells("A1:F1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "FLOWERSHOP";
    titleCell.font = { bold: true, size: 18, color: { argb: "FF0000" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF9C4" },
    };

    worksheet.mergeCells("A2:F2");
    const subtitleCell = worksheet.getCell("A2");
    subtitleCell.value = "Inventory Report";
    subtitleCell.font = { bold: true, size: 14, color: { argb: "4CAF50" } };
    subtitleCell.alignment = { horizontal: "center", vertical: "middle" };
    subtitleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E3F2FD" },
    };

    worksheet.mergeCells("A3:F3");
    const dateCell = worksheet.getCell("A3");
    dateCell.value = `Month/Year: ${selectedDate}`;
    dateCell.font = { italic: true, color: { argb: "000000" } };
    dateCell.alignment = { horizontal: "center", vertical: "middle" };
    dateCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "E3F2FD" },
    };

    worksheet.addRow([]);
    const headerRow = worksheet.getRow(6);
    headerRow.values = [
      "No.",
      "Name",
      "Beginning Inventory",
      "Total Imported",
      "Total Sold",
      "Ending Inventory",
    ];
    headerRow.font = { bold: true, size: 12, color: { argb: "FFFFFF" } };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1976D2" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    inventory.forEach((row, index) => {
      const rowIndex = index + 7;
      const dataRow = worksheet.getRow(rowIndex);
      dataRow.values = [
        index + 1,
        row.productEntity.name,
        row.beginningInventory,
        row.totalImported,
        row.totalSold,
        row.endingInventory,
      ];
      dataRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      dataRow.getCell(2).alignment = { horizontal: "left", vertical: "middle" };

      if (index % 2 === 0) {
        dataRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "E3F2FD" },
          };
        });
      }
    });

    worksheet.columns?.forEach((column) => {
      let maxLength = 0;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const value = cell.value ? cell.value.toString() : "";
        maxLength = Math.max(maxLength, value.length);
      });
      column.width = maxLength < 20 ? 20 : maxLength + 5;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const data = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(data, "Beautify_Inventory_Report.xlsx");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    const currentDate = new Date();
    const currentYearMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}`;

    if (selected > currentYearMonth) {
      setShowAlert(true);
      return;
    }
    setSelectedDate(selected);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="month"
          value={selectedDate}
          onChange={handleDateChange}
          className="input input-bordered w-40 bg-white"
        />
        <div className="space-x-2">
          <button onClick={handleGetInventory} className="btn btn-primary">
            Refresh
          </button>
          <button onClick={handleExportToExcel} className="btn btn-success">
            Export
          </button>
        </div>
      </div>

      {showAlert && (
        <div className="alert alert-error shadow-lg mb-4">
          <div className="flex justify-between w-full">
            <span>You cannot select a future date.</span>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => setShowAlert(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Beginning Inventory</th>
              <th>Total Imported</th>
              <th>Total Sold</th>
              <th>Ending Inventory</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{indexOfFirstItem + index + 1}</td>
                <td>{item.productEntity.name}</td>
                <td className="text-center">{item.beginningInventory}</td>
                <td className="text-center">{item.totalImported}</td>
                <td className="text-center">{item.totalSold}</td>
                <td className="text-center">{item.endingInventory}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center mt-4 space-x-1">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`btn btn-sm ${
                page === currentPage ? "btn-active btn-primary" : "btn-outline"
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="btn btn-sm btn-outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
