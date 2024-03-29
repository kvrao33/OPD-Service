CREATE TABLE opd.opd_proposal_details (
    proposal_number VARCHAR(50) PRIMARY KEY,
    policy_number VARCHAR(50),
    cust_name VARCHAR(100),
    cust_email VARCHAR(100),
    cust_mobile VARCHAR(20),
    cust_dob DATE,
    cust_gender VARCHAR(10),
    plan_code VARCHAR(50),
    risk_start_date DATE,
    risk_end_date DATE,
    business_type VARCHAR(50),
    policy_type VARCHAR(50),
    total_prem_without_gst NUMERIC(18, 2),
    city_district VARCHAR(100),
    cust_pincode VARCHAR(20),
    cust_state VARCHAR(100),
    transaction_type VARCHAR(50),
    prod_code VARCHAR(50),
    product_name VARCHAR(100),
    product_type VARCHAR(50),
    partner_code VARCHAR(50)
);