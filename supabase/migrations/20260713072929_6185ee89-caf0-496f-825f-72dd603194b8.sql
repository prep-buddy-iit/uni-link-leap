
CREATE POLICY "Anyone can upload to resource-uploads"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'resource-uploads');

CREATE POLICY "Anyone can read resource-uploads"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'resource-uploads');

CREATE POLICY "Admins can delete resource-uploads"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'resource-uploads' AND has_role(auth.uid(), 'admin'));
