import { useEffect } from "react";
import { ApiSqlClient } from "../libs/classes"; // Controlla il percorso

const QUERIES_URL = "/id-queries.json";

export default function TestQuery() {
    useEffect(() => {
        const runQuery = async () => {
            try {
                const response = await fetch('/id-queries.json');
                const queries = await response.json();

                //let query = queries["neg0001"];
                //query = query.replace('<anno>', '2024').replace('<sede>', 'DO');
                const neg0001 = `
SELECT Utente,
       ROUND(ISNULL([1],0),2) AS Gennaio,
       ROUND(ISNULL([2],0),2) AS Febbraio,
       ROUND(ISNULL([3],0),2) AS Marzo,
       ROUND(ISNULL([4],0),2) AS Aprile,
       ROUND(ISNULL([5],0),2) AS Maggio,
       ROUND(ISNULL([6],0),2) AS Giugno,
       ROUND(ISNULL([7],0),2) AS Luglio,
       ROUND(ISNULL([8],0),2) AS Agosto,
       ROUND(ISNULL([9],0),2) AS Settembre,
       ROUND(ISNULL([10],0),2) AS Ottobre,
       ROUND(ISNULL([11],0),2) AS Novembre,
       ROUND(ISNULL([12],0),2) AS Dicembre,
       ROUND(
           ISNULL([1],0) + ISNULL([2],0) + ISNULL([3],0) + ISNULL([4],0) + ISNULL([5],0) + ISNULL([6],0) +
           ISNULL([7],0) + ISNULL([8],0) + ISNULL([9],0) + ISNULL([10],0) + ISNULL([11],0) + ISNULL([12],0)
       ,2) AS TotaleAnno
FROM (
    SELECT DISTINCT '3cpr - ' + t.Banco AS Utente,
                    a.Mese,
                    CAST(SUM(a.TotRiga) AS FLOAT) AS Importo
    FROM Stats..consegnato a
    INNER JOIN Stats..Tecnici t ON a.UtenteAssegnato = t.Codice
    WHERE t.Banco NOT IN ('', 'y Amministrazione')
      AND a.Articolo NOT IN ('zzzacc')
      AND a.TipoRiga != 'Omaggio'
    GROUP BY t.Banco, a.Mese
) AS ground
PIVOT (
    SUM(Importo)
    FOR Mese IN ([1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12])
) AS Layer1
ORDER BY 1;
`;


                // Imposta la tua API key

                // Esegui la query
                const result = await sql.openQuery(neg0001); // openQuery restituisce tutte le righe
                console.log("Risultato query neg0001:", result);
            } catch (err) {
                console.error("Errore eseguendo la query:", err);
            }
        };

        runQuery();
    }, []);
    return (
        (null)
    );
}