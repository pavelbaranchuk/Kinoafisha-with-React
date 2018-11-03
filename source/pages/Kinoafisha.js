// Core
import React, { Component } from 'react';
import cx from 'classnames';

// Helpers
import { getStyles } from '../helpers';

// Api
import { api } from '../API';

export class Kinoafisha extends Component {
    state = {
        selectedFilter: 'upcoming',
        selectedMovie:  '',
        movies:         [],
    };

    componentDidMount() {
        this._getMoviesByFilter(this.state.selectedFilter);
    }

    _getMoviesByFilter = async (nextFilter) => {
        const movies = await api.getMovies(nextFilter);

        this.setState({
            movies,
        });
    };

    _selectFilter = (event) => {
        const nextFilter = event.currentTarget.dataset.name;

        this.setState({
            selectedFilter: nextFilter,
        });

        this._getMoviesByFilter(nextFilter);
    };

    _selectMovie = (movieId) => {
        return () => {
            this.setState({
                selectedMovie: movieId,
            });
        };
    };

    render() {
        const styles = getStyles(this.state);

        const moviesJSX = this.state.movies.map((movie) => {
            const posterStyle = cx('poster', {
                selectedPoster: movie.id === this.state.selectedMovie,
            });

            return (
                <div
                    className = 'movie'
                    key = { movie.id }
                    onClick = { this._selectMovie(movie.id) }>
                    <div className = { posterStyle }>
                        <span className = 'genre'>{movie.genre}</span>
                        <img src = { movie.poster } />
                        <span className = 'rating'>{movie.rating}</span>
                    </div>
                    <span className = 'title'>{movie.title}</span>
                </div>
            );
        });

        return (
            <>
                <div className = 'header'>
                    <div className = 'logo' />
                    <div className = 'filters'>
                        <div
                            className = { styles.latestFilter }
                            data-name = 'latest'
                            onClick = { this._selectFilter }>
                            <span>Новинки 2018</span>
                        </div>
                        <div
                            className = { styles.upcomingFilter }
                            data-name = 'upcoming'
                            onClick = { this._selectFilter }>
                            <span>Скоро в кинотеатрах</span>
                        </div>
                        <div
                            className = { styles.popularFilter }
                            data-name = 'popular'
                            onClick = { this._selectFilter }>
                            <span>В топ-чартах</span>
                        </div>
                    </div>
                </div>
                <div className = 'content'>{moviesJSX}</div>
            </>
        );
    }
}
