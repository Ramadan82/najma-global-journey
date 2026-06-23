alter table scholarships
  add column if not exists degree_type text check (
    degree_type in ('Bachelor''s', 'Master''s', 'PhD', 'Diploma', 'Certificate')
  );
