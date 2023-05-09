import { useState, useEffect } from "react";
import { RequestServer } from "../api/HttpReq";

export const useFetchRecords = (url) => {
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState({});
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    RequestServer(url)
      .then((res) => {
        if (res.success) {
          setRecords(res.data);
          setFetchLoading(false);
          setFetchError(null);
        } else {
          setRecords([]);
          setFetchError(res.error);
          setFetchLoading(false);
        }
      })
      .catch((err) => {
        setFetchError(err);
        setFetchLoading(false);
      });
  };

  return { records, fetchError, fetchLoading, refetch: fetchRecords };
};
