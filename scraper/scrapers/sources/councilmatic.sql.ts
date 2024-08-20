export const getSQLForBills = (chunkSize: number, offset: number) => {
  return `SELECT b.*, 
      ( SELECT json_group_array(
          json_object(
            'date', date, 
            'classification', json_extract(classification, '$[0]')
          )
        ) as actions 
        FROM billaction as ba 
        WHERE ba.bill_id == b.id 
        ORDER BY 'order'
      ) as actions
    FROM bill AS b
    WHERE json_extract(b.extras, '$.routine') = false
    AND b.updated_at >= date('now', '-6 months')
    ORDER BY b.updated_at DESC
    LIMIT ${chunkSize} OFFSET ${offset};`;
};

export const getSQLForBillSponsors = (bill_ids: string[]) => {
  return `SELECT * from billsponsorship
      WHERE billsponsorship.bill_id IN (${bill_ids
        .map((billId) => `'${billId}'`)
        .join(", ")})`;
};

export const getSQLForVoteEvents = (bill_ids: string[]) => {
  return `SELECT * from voteevent
      WHERE voteevent.bill_id IN (${bill_ids
        .map((billId) => `'${billId}'`)
        .join(", ")})`;
};
