import { useEffect, useState } from "react";
import { Typography, Card, CardMedia, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import "../styles/styles.css";

interface Genre {
  id: number;
  name: string;
  image: string;
}

const Home = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  const featuredMovies = [
    {
      id: 1,
      title: "Filme 1",
      video: "videos/filme1.mp4",
    },
    {
      id: 102,
      title: "Filme 2",
      video: "videos/filme2.mp4",
    },
    {
      id: 103,
      title: "Filme 3",
      video: "videos/filme3.mp4",
    },
  ];

  useEffect(() => {
    document.body.classList.add("bg-home");
    return () => {
      document.body.classList.remove("bg-home");
    };
  }, []);

  const handleGenreClick = (genreId: number) => {
    navigate(`/genero/${genreId}`);
  };

  useEffect(() => {
    const fetchGenres = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("api/genero", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGenres(response.data);
      } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <Box className="content">
      {/* carousel code unchanged */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "95%",
          mt: 4,
        }}
      >
        <Carousel
          showArrows={false}
          showStatus={false}
          showIndicators={true}
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={30000}
          stopOnHover={false}
          swipeable
          emulateTouch
        >
          {featuredMovies.map((movie) => (
            <div key={movie.id} style={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  padding: "4px 12px",
                  borderRadius: "8px",
                  fontSize: "1.2rem",
                  zIndex: 2,
                }}
              >
                Em breve
              </Box>

              <video
                src={movie.video}
                autoPlay
                muted
                loop
                style={{
                  maxHeight: "380px",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Carousel>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography
          variant="h4"
          className="title"
          sx={{ color: "white", textAlign: "center" }}
        >
          Escolha um Gênero
        </Typography>
      </Box>

      {/* Substituição do Grid container e items por divs flex */}
      <div className="genres-flex-container">
        {genres.map((genre) => (
          <div key={genre.id} className="genres-flex-item">
            <Card
              className="movie-card"
              onClick={() => handleGenreClick(genre.id)}
              style={{ cursor: "pointer" }}
            >
              <CardMedia
                component="img"
                image={genre.image || "https://via.placeholder.com/200"}
                title={genre.name}
                className="movie-image"
              />
              <Typography variant="h6" align="center" sx={{ color: "white" }}>
                {genre.name}
              </Typography>
            </Card>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default Home;
