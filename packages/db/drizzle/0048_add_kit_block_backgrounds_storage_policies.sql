-- Add RLS policies for kit-block-backgrounds storage bucket

-- Allow authenticated users to upload to kit-block-backgrounds bucket
CREATE POLICY "Authenticated users can upload background images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kit-block-backgrounds');

-- Allow public read access to background images
CREATE POLICY "Public can view background images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'kit-block-backgrounds');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update background images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'kit-block-backgrounds');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete background images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'kit-block-backgrounds');
