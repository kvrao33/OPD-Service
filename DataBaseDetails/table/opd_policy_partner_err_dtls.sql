CREATE TABLE opd.opd_policy_partner_err_dtls (
    policy_number VARCHAR(50),
    proposal_number VARCHAR(50),
    partner_code VARCHAR(10),
    error_dtls TEXT,
    created_dt TIMESTAMP,
    created_by VARCHAR(100),
    updated_dt TIMESTAMP,
    updated_by VARCHAR(100),
    request_dtl JSONB,
    execution_id UUID
);
