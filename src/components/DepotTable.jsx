import TableTemplate from './TableTemplate';

export default function DepotTable() {
  const fields = ["id", "user_id", "username", "adresse", "montant", "date_depot"];

  return (
    <TableTemplate 
      table="depot" 
      fields={fields} 
      title="Historique des Dépôts"
    />
  );
}