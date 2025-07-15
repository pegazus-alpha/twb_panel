import TableTemplate from './TableTemplate';

export default function CommissionsTable() {
  const fields = ["id", "user_id", "filleul_id", "niveau", "montant", "pourcentage", "date"];

  return (
    <TableTemplate 
      table="commissions" 
      fields={fields} 
      title="Suivi des Commissions"
    />
  );
}