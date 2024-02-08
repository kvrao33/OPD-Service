CREATE TABLE opd.opd_insured_details (
    insured_id SERIAL PRIMARY KEY,
    proposal_number VARCHAR(50),
    firstpolicyinceptiondate DATE,
    insured_name VARCHAR(100),
    insured_rel VARCHAR(100),
    insured_gender VARCHAR(10),
    insured_dob DATE,
    insured_member_id VARCHAR(50),
    insured_si NUMERIC(18, 2),
    insured_prem NUMERIC(18, 2),
    cover_name VARCHAR(100),
    cover_si NUMERIC(18, 2),
    cover_prem NUMERIC(18, 2),
    cover_endamount NUMERIC(18, 2),
    FOREIGN KEY (proposal_number) REFERENCES opd.opd_proposal_details(proposal_number)
);