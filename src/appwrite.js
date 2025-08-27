import { Client, ID, TablesDB, Query } from "appwrite";
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // if the search term already exists in the database, increment its count otherwise,
  try {
    const result = await tablesDB.listRows(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);
    if (result.total > 0) {
      const row = result.rows[0];
      await tablesDB.updateRow(DATABASE_ID, TABLE_ID, row.id, {
        count: row.count + 1,
      });
    } else {
      // create a new row in the database with the search term and count 1
      await tablesDB.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      });
    }
    console.log("existed row", result);
  } catch (error) {
    console.error(error);
  }
};
