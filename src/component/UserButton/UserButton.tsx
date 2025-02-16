import { Avatar, Group, Text, UnstyledButton, Center } from "@mantine/core";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfessional } from "../../store/slices/professionalSlice"; // Adjust the path if needed
import { RootState, AppDispatch } from "../../store/store";
import classes from "./UserButton.module.css";

export function UserButton() {

  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { data: professional, status, error } = useSelector(
    (state: RootState) => state.professional
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchProfessional(id));
    }
  }, [dispatch, id]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return <p>Error: {error}</p>;
  }

  return (
    <Center>
      <UnstyledButton className={classes.user}>
        <Group>
          <Avatar
            src={
              professional?.photo_url ||
              "https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
            }
            radius="xl"
          />
          <div style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {professional?.full_name || "Kritika Srivastava"}
            </Text>
            <Text c="dimmed" size="xs">
              {professional?.area_of_expertise || "Counselling Psychologist"}
            </Text>
          </div>
        </Group>
      </UnstyledButton>
    </Center>
  );
}
