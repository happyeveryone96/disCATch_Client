/*global kakao*/
import React, { useEffect, useState } from "react";

const Location = (props) => {
  //위도 저장
  const [latitude, setLatitude] = useState();
  //경도 저장
  const [longitude, setLongitude] = useState();

  useEffect(() => {
    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 일반 지도와 스카이뷰로 지도 타입을 전환할 수 있는 지도타입 컨트롤을 생성합니다
    var mapTypeControl = new kakao.maps.MapTypeControl();

    // 지도에 컨트롤을 추가해야 지도위에 표시됩니다
    // kakao.maps.ControlPosition은 컨트롤이 표시될 위치를 정의하는데 TOPRIGHT는 오른쪽 위를 의미합니다
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
    var zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

    //geolocation을 통해 현재 위치 보여주기 //
    // // HTML5의 geolocaiton으로 사용할 수 있는지 확인합니다.
    // if (navigator.geolocation) {
    //   // GeoLocation을 이용해서 접속 위치를 얻어옵니다.
    //   navigator.geolocation.getCurrentPosition(function (position) {
    //     var lat = position.coords.latitude, // 위도
    //       lon = position.coords.longitude; // 경도

    //     var locPostion = new kakao.maps.LatLng(lat, lon), //마커가 표시될 위치를 geolocation 좌표로 생성합니다.
    //       message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다.

    //     // 마커와 인포윈도우를 표시합니다.
    //     displayMarker(locPostion, message);
    //   });
    // } else {
    // }

    // // 지도에 마커와 인포윈도우를 표시하는 함수입니다.
    // function displayMarker(locPostion, message) {
    //   // 마커를 생성합니다.
    //   var marker = new kakao.maps.Marker({
    //     map: map,
    //     position: locPostion,
    //   });

    //   var iwContent = message, // 인포윈도우에 표시할 내용
    //     iwRemoveable = true;

    //   // 인포윈도우를 생성합니다.
    //   var infowindow = new kakao.maps.InfoWindow({
    //     content: iwContent,
    //     removable: iwRemoveable,
    //   });

    //   // 인포윈도우를 마커위에 표시합니다.
    //   infowindow.open(map, marker);

    //   지도 중심좌표를 접속위치로 변경합니다.
    //   map.setCenter(locPostion);
    // }

    const marker = new kakao.maps.Marker({ position: map.getCenter() });

    // 지도에 마커를 표시합니다.
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      //클릭한 위도, 경도 정보를 가져옵니다.
      const latlng = mouseEvent.latLng;
      //위도 경도 값을 useState를 이용해서 useEffect 밖으로 빼냅니다.
      setLatitude(latlng.getLat());
      setLongitude(latlng.getLng());
      //마커 위치를 클릭한 위치로 옮깁니다.
      marker.setPosition(latlng);
      //마커를 지도상에 보여줍니다.
      marker.setMap(map);
    });
  }, []);

  return (
    <div>
      <div
        id="map"
        style={{ width: "100%", height: "500px", margin: "auto" }}
      ></div>
      <div>
        여기는 경도 {latitude} 위도{longitude}입니다!
      </div>
    </div>
  );
};

export default Location;
