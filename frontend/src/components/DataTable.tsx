import type { ReactNode } from 'react';

export type DataTableColumn<T> = {
  /** Ustun va katak uchun barqaror kalit */
  key: string;
  header: ReactNode;
  /** <th> uchun */
  headerClassName?: string;
  /** Har bir <td> uchun */
  className?: string;
  render: (row: T, index: number) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Qator kaliti (odatda id) */
  rowKey: (row: T, index: number) => string;
  /** Ma’lumot bo‘lmaganda matn */
  emptyMessage?: string;
  tableClassName?: string;
  /** Jadval atrofida gorizontal scroll (keng jadvallar uchun) */
  wrap?: boolean;
};

/**
 * Barcha ro‘yxat sahifalarida bir xil ko‘rinishdagi jadval.
 * Ustunlar `columns` orqali e’lon qilinadi — har bir sahifa o‘z `T` tipi bilan ishlaydi.
 */
export default function DataTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage = 'Ma’lumot topilmadi.',
  tableClassName = 'data-table',
  wrap = true,
}: DataTableProps<T>) {
  const table = (
    <table className={tableClassName}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} className={col.headerClassName}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowKey(row, rowIndex)}>
            {columns.map((col) => (
              <td key={col.key} className={col.className}>
                {col.render(row, rowIndex)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <>
      {wrap ? <div className="data-table-wrap overflow-x-auto">{table}</div> : table}
      {data.length === 0 && <p className="text-empty">{emptyMessage}</p>}
    </>
  );
}

/** Amallar ustunida tahrirlash/o‘chirish tugmalari uchun bir xil joylashuv */
export function TableRowActions({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-3 py-1 ${className}`.trim()}>{children}</div>
  );
}
