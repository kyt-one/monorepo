CREATE OR REPLACE FUNCTION public.get_media_kit_daily_metrics(
    target_kit_id UUID,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    timezone TEXT DEFAULT 'UTC'
)
RETURNS TABLE (
    day TIMESTAMP,
    views BIGINT,
    shares BIGINT,
    contacts BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(start_date, end_date, '1 day'::interval) AS day
    )
    SELECT 
        ds.day,
        COUNT(ae.id) FILTER (WHERE ae.event_type = 'view') AS views,
        COUNT(ae.id) FILTER (WHERE ae.event_type = 'share') AS shares,
        COUNT(ae.id) FILTER (WHERE ae.event_type = 'contact_click') AS contacts
    FROM date_series ds
    LEFT JOIN media_kit_events ae 
        ON date_trunc('day', ae.created_at at time zone timezone) = ds.day
        AND ae.kit_id = target_kit_id
    GROUP BY ds.day
    ORDER BY ds.day;
END;
$$;