const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const movies = [
  { title: "El Padrino", coverUrl: "https://picsum.photos/seed/padrino/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Inception", coverUrl: "https://picsum.photos/seed/inception/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Interstellar", coverUrl: "https://picsum.photos/seed/interstellar/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "The Dark Knight", coverUrl: "https://picsum.photos/seed/batman/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Pulp Fiction", coverUrl: "https://picsum.photos/seed/pulp/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Forrest Gump", coverUrl: "https://picsum.photos/seed/forrest/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Matrix", coverUrl: "https://picsum.photos/seed/matrix/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "El Señor de los Anillos: El Retorno del Rey", coverUrl: "https://picsum.photos/seed/lotr/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Gladiador", coverUrl: "https://picsum.photos/seed/gladiator/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "El Club de la Pelea", coverUrl: "https://picsum.photos/seed/fightclub/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Star Wars: Episodio V", coverUrl: "https://picsum.photos/seed/starwars/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Interestelar", coverUrl: "https://picsum.photos/seed/interestelar/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Seven", coverUrl: "https://picsum.photos/seed/seven/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "La Lista de Schindler", coverUrl: "https://picsum.photos/seed/schindler/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "El Silencio de los Inocentes", coverUrl: "https://picsum.photos/seed/silence/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Avengers: Infinity War", coverUrl: "https://picsum.photos/seed/avengers1/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Avengers: Endgame", coverUrl: "https://picsum.photos/seed/avengers2/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Jurassic Park", coverUrl: "https://picsum.photos/seed/jurassic/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Titanic", coverUrl: "https://picsum.photos/seed/titanic/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Avatar", coverUrl: "https://picsum.photos/seed/avatar/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Spider-Man: No Way Home", coverUrl: "https://picsum.photos/seed/spiderman/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "El Rey León", coverUrl: "https://picsum.photos/seed/lionking/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Regreso al Futuro", coverUrl: "https://picsum.photos/seed/bttf/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Los Increíbles", coverUrl: "https://picsum.photos/seed/incredibles/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Duna: Parte Dos", coverUrl: "https://picsum.photos/seed/dune/400/600", downloadUrl: "https://mega.nz/test" },
  { title: "Breaking Bad (Temporada Completa)", coverUrl: "https://picsum.photos/seed/breakingbad/400/600", downloadUrl: "https://mega.nz/test" }
];

async function main() {
  console.log('Seeding database...');
  for (const movie of movies) {
    await prisma.movie.create({
      data: movie,
    });
  }
  console.log('Database seeded with 25 movies and 1 series!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
