"use client";
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

// Define types for our GraphQL data
interface Author {
  id: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  content: string;
  author: Author;
}

interface Game {
  id: string;
  title: string;
  platform: string[];
  reviews: Review[];
}

interface GamesData {
  games: Game[];
}

export default function Home() {
  const router = useRouter();
  const GET_GAMES = gql`
    query GetGames {
      games {
        id
        title
        platform
        reviews {
          id
          rating
          content,
          author {
            id
            name
          }
        }
      }
    }
  `;
  
  const { loading, error, data } = useQuery<GamesData>(GET_GAMES);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold mb-6">Graphql connected to Next.js</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.games.map((game) => (
            <div key={game.id} className="border rounded-lg p-4 shadow-md cursor-pointer" onClick={() => router.push(`/game-details?id=${game.id}`)}>
              <h2 className="text-xl font-semibold">{game.title}</h2>
              <p className="mt-2"><span className="font-medium">Platforms:</span> {game.platform.join(', ')}</p>
              <div className="mt-4">
                <h3 className="font-medium mb-2">Reviews:</h3>
                {game.reviews && game.reviews.length > 0 ? (
                  <ul className="space-y-2">
                    {game.reviews.map((review) => (
                      <li key={review.id} className="border-l-2 border-gray-300 pl-3">
                        <p>Rating: {review.rating}/5</p>
                        <p className="text-sm">{review.content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
