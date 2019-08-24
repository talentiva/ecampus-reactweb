import {
  AppBar,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
  withStyles,
  Button
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MapIcon from "@material-ui/icons/Map";
import React from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import appConfig from "./appConfig.json";

const styles = theme => ({
  attractionCategoryItem: {
    textAlign: "center",
    display: "flex"
  },
  attractionPaper: {
    flex: 1,
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    height: "12rem",
    textDecoration: "none"
  }
});

class StudentListFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mahasiswas: [],
      page: {}
    };
  }

  componentDidMount() {
    this.fetchStudents();
  }

  componentDidUpdate(prevProps) {
    const prevPage = prevProps.match.params.page || 0;
    const newPage = this.props.match.params.page || 0;
    if (prevPage != newPage) {
      this.fetchStudents();
    }
  }

  async fetchStudents() {
    const pageNumber = this.props.match.params.page || 0;
    // const { cityId, attractionCategoryId } = this.props.match.params;
    const studentsUrl = `${
      appConfig.ecampusApiUrl
    }/mahasiswas?page=${pageNumber}`;
    console.info("Fetching", studentsUrl, "...");
    const resp = await fetch(studentsUrl, { method: "GET" });
    const json = await resp.json();
    this.setState({
      mahasiswas: json._embedded.mahasiswas,
      page: json.page
    });
    console.debug("_embedded.mahasiswas=", json._embedded.mahasiswas);
  }

  render() {
    const { classes, match, location, history } = this.props;
    const { mahasiswas, page } = this.state;
    // const { cityId, attractionCategoryId } = match.params;
    return (
      <div style={{ display: "flex", flex: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={e => history.goBack()}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Daftar Mahasiswa
            </Typography>
            <IconButton edge="end" color="inherit" aria-label="map">
              <MapIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid
          container
          style={{
            margin: "4.5rem 0.5rem 0.5rem 0.5rem",
            alignContent: "baseline"
          }}
          spacing={1}
        >
          {mahasiswas.map(mahasiswa => (
            <Grid
              item
              key={mahasiswa.nim}
              xs={12}
              md={6}
              className={classes.attractionCategoryItem}
            >
              <Paper
                component={Link}
                to={`/students/${mahasiswa.id}`}
                className={classes.attractionPaper}
                style={{
                  backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(https://placeimg.com/640/480/arch?t=${
                    mahasiswa.fileName
                  })`
                }}
              >
                <FavoriteIcon
                  color={mahasiswa.favorited ? "secondary" : "inherit"}
                  style={{ alignSelf: "flex-end" }}
                />
                <div style={{ flex: 1 }} />
                <Typography variant="body1" style={{ textAlign: "left" }}>
                  {mahasiswa.nama}
                </Typography>
                <Typography variant="caption" style={{ textAlign: "left" }}>
                  {mahasiswa.nim}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Button to={`/${page.number + 1}`}
          component={Link}>Next</Button>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(StudentListFragment));
