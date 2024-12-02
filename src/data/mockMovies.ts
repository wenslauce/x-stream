import { MovieCategory } from '../types/movie';

export const movieCategories: MovieCategory[] = [
  {
    title: "Trending Now",
    movies: [
      {
        id: "1",
        title: "The Space Between Stars",
        description: "A journey through space that challenges our understanding of time and love.",
        thumbnailUrl: "https://images.unsplash.com/photo-1596727147705-61a532a659bd",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        genre: "Sci-Fi",
        year: 2024,
        duration: "2h 15m"
      },
      {
        id: "2",
        title: "Urban Legends",
        description: "A detective uncovers the truth behind city myths.",
        thumbnailUrl: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        genre: "Thriller",
        year: 2024,
        duration: "1h 55m"
      },
      {
        id: "3",
        title: "The Last Dawn",
        description: "Survivors of a global catastrophe search for hope.",
        thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        genre: "Drama",
        year: 2024,
        duration: "2h 30m"
      }
    ]
  },
  {
    title: "New Releases",
    movies: [
      {
        id: "4",
        title: "Midnight Symphony",
        description: "A musician's journey through the underground music scene.",
        thumbnailUrl: "https://images.unsplash.com/photo-1514533212735-5df27d970db9",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        genre: "Drama",
        year: 2024,
        duration: "2h 5m"
      },
      {
        id: "5",
        title: "Digital Dreams",
        description: "Virtual reality becomes too real in this tech thriller.",
        thumbnailUrl: "https://images.unsplash.com/photo-1535016120720-40c646be5580",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        genre: "Sci-Fi",
        year: 2024,
        duration: "1h 48m"
      },
      {
        id: "6",
        title: "Ocean's Memory",
        description: "A deep-sea expedition reveals ancient secrets.",
        thumbnailUrl: "https://images.unsplash.com/photo-1551244072-5d12893278ab",
        videoUrl: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
        genre: "Adventure",
        year: 2024,
        duration: "2h 20m"
      }
    ]
  }
];