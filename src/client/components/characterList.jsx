import React, { Component } from 'react';
import axios from 'axios';
import MovieInfo from './movieInfo.jsx';

class CharList extends Component {
  constructor() {
    super();
    this.state = {
      selectedChar: null,
      selectedFilms: [],
      chars: {},
    };
    this.getCharInfo = this.getCharInfo.bind(this);
    this.getFilmInfo = this.getFilmInfo.bind(this);
  }

  componentDidMount() {
    this.getCharList();
  }

  async getCharList() {
    try {
      const response = await axios.get('http://localhost:6969/characters');
      this.setState(() => {
        const updatedCharObj = {};
        response.data.characters.forEach((char) => {
          const { url } = char;
          updatedCharObj[char.name] = { url };
        });
        return { chars: updatedCharObj };
      });
    } catch (error) {
      return error;
    }
  }

  async getCharInfo(url) {
    try {
      const charResults = await axios.get(url);
      this.setState((currState) => {
        const stateCopy = currState;
        const { chars } = stateCopy;
        const { data } = charResults;

        const validInfoObj = {};
        Object.entries(data).forEach(([key, val]) => {
          if (!/[^A-z0-9]/.test(val) && !Array.isArray(val)) validInfoObj[key] = val;
        });

        console.log(validInfoObj);
        if (chars[data.name]) {
          chars[data.name].info = validInfoObj;
          chars[data.name].info.films = data.films;
          stateCopy.selectedChar = data.name;
        } else {
          chars[data.name] = { info: validInfoObj };
          stateCopy.selectedChar = charResults.data.name;
        }

        return stateCopy;
      });
      console.log(this.state);

      this.getFilmInfo();
    } catch (err) {
      return err;
    }
  }

  async getFilmInfo() {
    try {
      const { chars, selectedChar } = this.state;
      const { films } = chars[selectedChar].info;
      const filmsProms = films.map(async (url) => {
        const response = await axios.get(url);
        return {
          title: response.data.title,
          date: new Date(response.data.release_date).toDateString(),
        };
      });

      const selectedFilms = await Promise.all(filmsProms);

      this.setState(currState => ({ ...currState, selectedFilms }));
      this.componentDidUpdate();
      console.log(this.state.selectedFilms);
    } catch (error) {
      return error;
    }
  }

  render() {
    const { chars, selectedChar, selectedFilms } = this.state;
    let key = 0;
    const charNames = Object.entries(chars).map(([char, url]) => {
      key += 1;
      return (
        <div
          key={`id${key}`}
          onClick={(e) => {
            this.getCharInfo(url.url);
          }}
        >
          {char}
        </div>
      );
    });

    return (
      <div className="charlist">
        <div>{charNames}</div>
        <hr />
        {selectedChar && selectedFilms.length > 0 ? (
          <div>
            <MovieInfo state={this.state} />
          </div>
        ) : (
          <div>Dance Dance Dance</div>
        )}
      </div>
    );
  }
}

export default CharList;
