// const options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000};
//
//
// export const getInitalPosition = () => {
//   navigator.geolocation.getCurrentPosition((position) => {
//     return position;
//   }, (error) => alert(JSON.stringify(error)), options);
// };
//
// export const getCurrentPosition = () => {
//
//   navigator.geolocation.watchPosition((position) => {
//     // this.setState({userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}});
//     return position;
//   }, (error) => alert(JSON.stringify(error)), options);
//   return console.log('Getting current POs');
// };
// // import React from 'react';
// //
// // class GetUserLocation extends React.Component {
// //   constructor(props) {
// //     super(props);
// //     this.state = {
// //       userPosition: {
// //         lat: '',
// //         lng: ''
// //       }
// //     };
// //   }
// //
// //   componentDidMount() {
// //     let options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000};
// //
// //     navigator.geolocation.getCurrentPosition((position) => {
// //       this.setState({userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}});
// //     }, (error) => alert(JSON.stringify(error)), options);
// //
// //     navigator.geolocation.watchPosition((position) => {
// //       this.setState({userPosition: {lat: position.coords.latitude, lng: position.coords.longitude}});
// //     }, (error) => alert(JSON.stringify(error)), options);
// //
// //     this.props.getUserLocation(this.state.userPosition);
// //   }
// //
// //   render() {
// //     // console.log('Within getLoc', this.state.userPosition);
// //     return (
// //       // <div>this.state.userPosition</div>
// //       <div></div>
// //     );
// //   }
// // }
// //
// // GetUserLocation.defaultProps = {};
// // GetUserLocation.propTypes = {};
// //
// // export default GetUserLocation;
