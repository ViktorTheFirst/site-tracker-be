enum SiteStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

interface ISite {
  id?: number;
  creator_id: number;
  name: string;
  hosting_provider: string | null;
  hosting_login: string | null;
  hosting_password: string | null;
  hosting_valid_until: string | null;
  domain_registrar: string | null;
  domain_login: string | null;
  domain_password: string | null;
  domain_valid_until: string | null;
  comments: string | null;
  status: SiteStatus;
  last_modified_by: string | null;
  created_at: string;
  updated_at: string;
}

export { ISite };
