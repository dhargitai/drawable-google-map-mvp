<template>
  <q-page class="flex flex-center column">

    <q-toggle
      v-model="isDrawing"
      label="Can draw"
    />

    <div id="stageContainer" ref="stageContainer">
      <v-stage :config="stageSize" ref="stage"
               v-show="isDrawing"
               @mousedown="onMouseDown"
               @touchstart="onMouseDown"
               @mouseup="onMouseUp"
               @touchend="onMouseUp"
               @mousemove="onMouseMove"
               @touchmove="onMouseMove"
               class="stage"
      >
      </v-stage>
      <gmap-map
        :center="center"
        :zoom="zoom"
        style="width:100%; height: 100%;"
        class="col"
        @center_changed="updateCenter"
        @zoom_changed="updateZoom"
        :key="mapId">
      </gmap-map>
    </div>

  </q-page>
</template>

<script>
  import { gmapApi } from 'vue2-google-maps';
  import { uid } from 'quasar';

export default {
  name: 'PageIndex',

  data() {
    return {
      isDrawing: true,

      stageSize: {
        width: null,
        height: null
      },

      isPaint: false,
      mode: 'brush',
      lastLine: null,
      layer: null,

      center: { lat: 47.4787, lng: 19.0829 },
      updatedCenter: {},
      zoom: 14,

      mapId: uid(),
    }
  },

  created() {
  },

  mounted() {
    this.layer = new Konva.Layer();
    this.$refs.stage.getStage().add(this.layer);
    this.stageSize.width = this.$refs.stageContainer.clientWidth;
    this.stageSize.height = this.$refs.stageContainer.clientHeight;
    this.geolocate();
  },

  computed: {
    google: gmapApi,
  },

  methods: {
    updateCenter(latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      this.updatedCenter = { lat, lng };
    },

    updateZoom(zoom) {
      this.zoom = zoom;
    },

    geolocate() {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.updatedCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    },



    onMouseDown(event) {
      this.isPaint = true;
      let pos = this.$refs.stage.getStage().getPointerPosition();
      this.lastLine = new Konva.Line({
        stroke: '#df4b26',
        strokeWidth: 5,
        globalCompositeOperation:
          this.mode === 'brush' ? 'source-over' : 'destination-out',
        points: [pos.x, pos.y]
      });
      this.layer.add(this.lastLine);
    },

    onMouseUp(event) {
      console.log('onMouseUp, points> ', this.lastLine.points());
      this.isPaint = false;
    },

    onMouseMove(event) {
      if (!this.isPaint) {
        return;
      }
      const pos = this.$refs.stage.getStage().getPointerPosition();
      let newPoints = this.lastLine.points().concat([pos.x, pos.y]);
      this.lastLine.points(newPoints);
      this.layer.batchDraw();
    },
  },
};
</script>

<style>
  .stage {
    border: 1px solid;
    position: absolute;
    z-index: 1;
  }

  #stageContainer {
    width: 600px;
    height: 400px;
    position: relative;
  }
</style>
