export type Rdv = {
  id: string;
  doctor: {
    departement: {
      label: string;
    };
    firstname: string;
    lastname: string;
  };
  start_time: string;
};
