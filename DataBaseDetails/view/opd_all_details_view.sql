CREATE OR REPLACE VIEW opd.opd_all_details_view AS
SELECT
    op.policy_number,
    op.proposal_number,
    op.cust_name,
    op.cust_email,
    op.cust_mobile,
    op.cust_dob,
    op.cust_gender,
    op.plan_code,
    op.risk_start_date,
    op.risk_end_date,
    op.business_type,
    op.policy_type,
    op.total_prem_without_gst,
    op.city_district,
    op.cust_pincode,
    op.cust_state,
    op.transaction_type,
    op.prod_code,
    op.product_name,
    op.product_type,
    op.partner_code,
    JSONB_AGG(
        JSONB_BUILD_OBJECT(
            'firstpolicyinceptiondate',oi.firstpolicyinceptiondate, 
	    'insured_name',oi.insured_name,
	    'insured_rel',oi.insured_rel,
	    'insured_gender',oi.insured_gender,
	    'insured_dob',oi.insured_dob,
	    'insured_member_id',oi.insured_member_id,
	    'insured_si',oi.insured_si,
	    'insured_prem',oi.insured_prem,
	    'cover_name',oi.cover_name,
	    'cover_si',oi.cover_si,
	    'cover_prem',oi.cover_prem,
	    'cover_endamount',oi.cover_endamount
        )
    ) AS insured_details
FROM opd.opd_proposal_details op
LEFT JOIN opd.opd_insured_details oi ON op.proposal_number = oi.proposal_number
WHERE
    op.proposal_number NOT IN (SELECT proposal_number FROM opd.opd_policy_partner_details)
GROUP BY
    op.policy_number,
    op.proposal_number,
    op.cust_name,
    op.cust_email,
    op.cust_mobile,
    op.cust_dob,
    op.cust_gender,
    op.plan_code,
    op.risk_start_date,
    op.business_type,
    op.policy_type,
    op.total_prem_without_gst,
    op.city_district,
    op.cust_pincode,
    op.cust_state,
    op.transaction_type,
    op.prod_code,
    op.product_name,
    op.product_type,
    op.partner_code;