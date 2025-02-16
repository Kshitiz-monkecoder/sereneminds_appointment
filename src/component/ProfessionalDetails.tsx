import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfessional } from "../store/slices/professionalSlice"; // Adjust path
import { RootState, AppDispatch } from "../store/store";

const ProfessionalDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data, status, error } = useSelector((state: RootState) => state.professional);

  useEffect(() => {
    if (id) {
      dispatch(fetchProfessional(id));
    }
  }, [dispatch, id]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Professional Details</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default ProfessionalDetails;
