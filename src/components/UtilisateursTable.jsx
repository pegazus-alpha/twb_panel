import TableTemplate from './TableTemplate';

export default function UtilisateursTable() {
  const fields = [
    "user_id", "parrain_id", "nom", "langue", "montant_depot", 
    "benefice_total", "commissions_totales", "date_enregistrement", 
    "adresse_wallet", "date_mise_a_jour", "cycle", "statut"
  ];

  return (
    <TableTemplate 
      table="utilisateurs" 
      fields={fields} 
      title="Gestion des Utilisateurs"
    />
  );
}