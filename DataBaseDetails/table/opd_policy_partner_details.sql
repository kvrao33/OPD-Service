CREATE TABLE opd.opd_policy_partner_details (
    policy_number VARCHAR(50),
    proposal_number VARCHAR(50),
    partner_code VARCHAR(10),
    partner_username VARCHAR(100),
    registration_status CHAR(1),
    created_dt TIMESTAMP,
    created_by VARCHAR(100),
    updated_dt TIMESTAMP,
    updated_by VARCHAR(100),
    execution_id UUID
);
