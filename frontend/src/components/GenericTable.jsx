// src/components/GenericTable.jsx
function GenericTable({ columns, data, onRowClick, actions, getRowId }) {
  const rowId = getRowId || ((row) => row.id);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}
            >
              {col.header}
            </th>
          ))}
          {actions ? (
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>
              Actions
            </th>
          ) : null}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr
            key={rowId(row)}
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((col) => (
              <td key={col.key} style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
            {actions ? (
              <td
                style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}
                onClick={(e) => e.stopPropagation()}
              >
                {actions(row)}
              </td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default GenericTable;
