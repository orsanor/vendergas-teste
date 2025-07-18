import { useCallback, useEffect, useRef, useState } from "react";
import type { Company } from "@/types/company";

export function useCompanies(userId?: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const firstFetchDone = useRef(false);

  const fetchCompanies = useCallback(() => {
    const url = userId
      ? `${baseUrl}/api/v1/companies?userId=${userId}`
      : `${baseUrl}/api/v1/companies`;
    setLoading(true);
    fetch(url, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: Company[]) => {
        setCompanies(
          data.map((company) => ({
            id: company.id,
            tradeName: company.tradeName,
            legalName: company.legalName,
            cnpj: company.cnpj,
          }))
        );
      })
      .finally(() => {
        setLoading(false);
        firstFetchDone.current = true;
      });
  }, [userId, baseUrl]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    const handler = () => {
      if (firstFetchDone.current && companies.length === 0) {
        fetchCompanies();
      } else if (companies.length > 0) {
        fetchCompanies();
      }
    };
    window.addEventListener("companyListChanged", handler);
    return () => window.removeEventListener("companyListChanged", handler);
  }, [fetchCompanies, companies.length]);

  return { companies, loading, refetch: fetchCompanies };
}
