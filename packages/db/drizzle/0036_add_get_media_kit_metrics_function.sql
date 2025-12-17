CREATE OR REPLACE FUNCTION public.get_media_kit_metrics(target_kit_id UUID)
RETURNS TABLE (
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
    SELECT
        COUNT(id) FILTER (WHERE event_type = 'view') AS views,
        COUNT(id) FILTER (WHERE event_type = 'share') AS shares,
        COUNT(id) FILTER (WHERE event_type = 'contact_click') AS contacts
    FROM media_kit_events
    WHERE kit_id = target_kit_id;
END;
$$;