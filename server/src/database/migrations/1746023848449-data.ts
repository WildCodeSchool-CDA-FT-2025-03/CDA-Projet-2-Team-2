import { MigrationInterface, QueryRunner } from 'typeorm';

export class Data1746023848449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO city
        SELECT id,cast(postal_code as varchar(15)),city FROM citytemp;`,
    );

    await queryRunner.query(
      `INSERT INTO departement (label, status, building, wing, level)
        SELECT
            m.service,
            'active',
            '',
            '',
            ''
        from mytable m
        GROUP BY 1;`,
    );

    await queryRunner.query(
      `INSERT INTO "user"(email, password,firstname,lastname,status,"departementId")
          SELECT
              m.email_medecin,
              '',
              substr(m.nom_medecin,1,POSITION(' ' IN m.nom_medecin)),
              substr(m.nom_medecin,POSITION(' ' IN m.nom_medecin)),
              'active',
              max(d.id)
          FROM mytable m
          INNER JOIN departement d ON d.label = m.service
          GROUP by m.email_medecin,m.nom_medecin,m.genre_medecin;`,
    );

    await queryRunner.query(
      `INSERT INTO patient (email, firstname, lastname, phone_number, social_number, private_assurance, gender, birth_date, note, "cityId")
        SELECT
            m.email_patient,
            substr(m.nom_patient,1,POSITION(' ' IN m.nom_patient)),
            substr(m.nom_patient,POSITION(' ' IN m.nom_patient)),
            '',
            m.social_number,
            '',
            m.sex_patient,
            cast(m.date_naissance_patient as date),
            '',
            max(c.id)
        FROM mytable m
        INNER JOIN city c
            ON substr(c.postal_code,1,5) = substr(m.code_postal,1,5)
        GROUP BY
            m.nom_patient,
            m.social_number,
            m.date_naissance_patient,
            m.email_patient,
            m.sex_patient;`,
    );

    await queryRunner.query(
      `INSERT INTO planning (start, monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end, "user_id")
        SELECT
            CURRENT_DATE + INTERVAL '-1 day',
            CASE WHEN m."jours_ouvrés" LIKE '%lundi%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%lundi%' then cast(heure_fin as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%mardi%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%mardi%' then cast(heure_fin as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%mercredi%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%mercredi%' then cast(heure_fin as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%jeudi%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%jeudi%' then cast(heure_fin as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%vendredi%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%vendredi%' then cast(heure_fin as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%samedi%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%samedi%' then cast(heure_fin as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%dimanche%' then cast(heure_debut as time) end,
            CASE WHEN m."jours_ouvrés" LIKE '%dimanche%' then cast(heure_fin as time) end,
            u.id
        FROM mytable m
        INNER JOIN "user" u ON u.firstname = substr(m.nom_medecin,1,POSITION(' ' IN m.nom_medecin)) AND u.lastname = substr(m.nom_medecin,POSITION(' ' IN m.nom_medecin))
        GROUP BY u.id,m."jours_ouvrés",heure_debut ,heure_fin;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE  FROM departement;`);
  }
}
