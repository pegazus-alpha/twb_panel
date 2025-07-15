import TableTemplate from './TableTemplate';

export default function RetraitsTable() {
  const fields = ["id", "user_id", "username", "adresse", "reseau", "montant", "date_retrait"];

  return (
    <TableTemplate 
      table="retraits" 
      fields={fields} 
      title="Historique des Retraits"
    />
  );
}