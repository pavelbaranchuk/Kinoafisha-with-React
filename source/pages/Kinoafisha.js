// Core
import React, { Component } from "react";
import cx from "classnames";

// Helpers
import { getStyles } from "../helpers";

// Api
import { api } from "../API";

export class Kinoafisha extends Component {
  state = {
    selectedFilter: "upcoming",
    selectedMovie: "",
    movies: [],
    sortCriteria: "asc"
  };

  componentDidMount() {
    this._getMoviesByFilter(this.state.selectedFilter);
  }

  _getMoviesByFilter = async (nextFilter, sortCriteria) => {
    const movies = await api.getMovies(nextFilter);
    sortCriteria === "desc"
      ? movies.sort((a, b) => {
          return b.release - a.release;
        })
      : movies.sort((a, b) => {
          return a.release - b.release;
        });
    this.setState({
      movies
    });
  };

  _selectFilter = event => {
    const nextFilter = event.currentTarget.dataset.name;

    this.setState({
      selectedFilter: nextFilter
    });
    this._getMoviesByFilter(nextFilter, this.state.sortCriteria);
  };

  _selectMovie = movieId => {
    return () => {
      this.setState({
        selectedMovie: movieId
      });
    };
  };

  _sortContent = (event, state) => {
    return event => {
      if (this.state.sortCriteria === "asc") {
        event.currentTarget.classList.add("desc");
        this.setState({ sortCriteria: "desc" });
      } else {
        event.currentTarget.classList.remove("desc");
        this.setState({ sortCriteria: "asc" });
      }
      this._getMoviesByFilter(
        this.state.selectedFilter,
        this.state.sortCriteria
      );
    };
  };

  render() {
    const styles = getStyles(this.state);
    const moviesJSX = this.state.movies.map(movie => {
      const posterStyle = cx("poster", {
        selectedPoster: movie.id === this.state.selectedMovie
      });

      return (
        <div
          className="movie"
          key={movie.id}
          onClick={this._selectMovie(movie.id)}
        >
          <div className={posterStyle}>
            <span className="genre">{movie.genre}</span>
            <img src={movie.poster} />
            <span className="rating">{movie.rating}</span>
          </div>
          <span className="title">{movie.title}</span>
        </div>
      );
    });

    return (
      <>
        <div className="header">
          <div className="logo" />
          <div className="filters">
            <div
              className={styles.latestFilter}
              data-name="latest"
              onClick={this._selectFilter}
            >
              <span>Новинки 2018</span>
            </div>
            <div
              className={styles.upcomingFilter}
              data-name="upcoming"
              onClick={this._selectFilter}
            >
              <span>Скоро в кинотеатрах</span>
            </div>
            <div
              className={styles.popularFilter}
              data-name="popular"
              onClick={this._selectFilter}
            >
              <span>В топ-чартах</span>
            </div>
          </div>
        </div>
        <div className="sorting">
          <button
            className={styles.sortButton}
            onClick={this._sortContent(event, this.state)}
          >
            по новизне
          </button>
        </div>
        <div className="content">{moviesJSX}</div>
        <div className="footer">
          <a href="mailto:team@lectrum.io">tesm@lectrum.io</a>
          <span>
            2018 © Все права защищены. Разработано с любовью &nbsp;
            <a href="https://lectrum.io/intensive/react">в Лектруме</a>
          </span>
          <div className="social">
            <a className="facebook" href="https://www.facebook.com/lectrum/" />
            <a className="telegram" href="https://t.me/lectrum" />
          </div>
        </div>
      </>
    );
  }
}
