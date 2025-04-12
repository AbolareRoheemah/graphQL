"use client";
import { useQuery, gql } from '@apollo/client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Define types for our GraphQL data
interface Author {
  id: string;
  name: string;
  verified: boolean;
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

interface GameData {
  game: Game;
}

export default function GameDetails() {
  const searchParams = useSearchParams();
  const gameId = searchParams.get('id');

  const GET_GAME = gql`
    query GetGame($id: ID!) {
      game(id: $id) {
        id
        title
        platform
        reviews {
          id
          rating
          content
          author {
            id
            name
            verified
          }
        }
      }
    }
  `;
  
  const { loading, error, data } = useQuery<GameData>(GET_GAME, {
    variables: { id: gameId },
    skip: !gameId
  });

//   const { loading, error, data } = useQuery<GameData>(GET_GAME, {
//     variables: { id: gameId}
//   })
  
  if (!gameId) return <p className="text-center mt-10">Game ID is required</p>;
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10">Error: {error.message}</p>;
  if (!data?.game) return <p className="text-center mt-10">Game not found</p>;
  
  const game = data.game;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link href="/" className="text-blue-500 hover:underline mb-6 inline-block">
        &larr; Back to all games
      </Link>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{game.title}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Platforms</h2>
          <div className="flex flex-wrap gap-2">
            {game.platform.map(platform => (
              <span key={platform} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {game.reviews && game.reviews.length > 0 ? (
          <div className="space-y-6">
            {game.reviews.map(review => (
              <div key={review.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{review.author.name}</span>
                    {review.author.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                    )}
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Rating: {review.rating}/10
                  </div>
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet for this game.</p>
        )}
      </div>
    </div>
  );
}
