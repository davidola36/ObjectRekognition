<template>
    <div class="rek--top">
      <input type="file" id="filePicker" ref="img" @change="imageHandler" style="visibility:hidden">
      <h1 class="rek--title">Image Detection with Rekognition</h1>


      <div class="rek--contentCont">
        <div class="rek--contentCont1">
          <div class="search--box" @click="openFilePicker">
            <img :src="captured" alt="Search image" v-if="captured && (loadState=='initial' || loadState == 'complete')" class="search--img"/>
            <span v-if="!captured && loadState=='initial'">click here to add image</span>
            <span v-if="loadState=='loading'">Searching for image</span>
          </div>
          <div class="search--itemsCont">
            <button class="button--primary" :disabled="!captured" @click="searchItem">Find Item</button>
            <button class="button--secondary" @click="reset">Reset Image</button>
          </div>
        </div>
        <div class="rek--contentCont1">
          <div v-if="loadState=='initial' || loadState=='loading'">
            <h4>No Search made</h4>
          </div>
          <div v-if="loadState=='complete'">
            <div v-if="!labels">No item was rekognized in the image provided</div>
            <div v-else>
              <h4 class="search--title">These items were found in the image</h4>
              <div class="search--item" style="font-weight:bold"><span>Name</span> <span>Confidence Level</span></div>
              <div v-for="(item, i) in labels" :key="i" class="search--item"><span>{{item.Name}}</span> <span>{{item.Confidence}}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
export default {
  data: () => {
    return {
      captured: null,
      loadState: 'initial',
      file: null,
      labels: []
    }
  },
  methods: {
    searchItem() {
      this.loadState = 'loading'
      this.uploadImage()
    },
    uploadImage() {
       window.s3.upload(
        {
          Key: this.file.name,
          Body: this.file,
          ACL: "public-read"
        },
        (err, data) => {
          if (err) {
            return console.log("Ran into an error: ", err);
          }
          console.log(data, "upload complete")
          this.detectLabels(data)
        })
    },
    detectLabels(data) {
      console.log('detecting labels')
      var params = {
      Image: {
        S3Object: {
          Bucket: "peexoo.useridcards", 
          Name: data.Key
        }
        }, 
        MaxLabels: 123, 
        MinConfidence: 70
      };
      let vm = this
      window.rekognition.detectLabels(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else    {
          vm.loadState = 'complete'
          vm.labels = data.Labels
          console.log(data, "done")
        }        // successful response
        /*
        data = {
          Labels: [
            {
            Confidence: 99.25072479248047, 
            Name: "People"
          }, 
            {
            Confidence: 99.25074005126953, 
            Name: "Person"
          }
          ]
        }
        */
      });
    },
    reset() {
      this.captured = null
      this.loadState = "initial"
      this.labels = []
    },
    imageHandler(e) {
      var files = e.target.files;
      this.file = files[0]
      this.previewImage(files[0])
    },
    previewImage(image) {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      let vm = this
      reader.onloadend = () => {
          let result = reader.result
          vm.captured = result;
          // this.image = image;
      }
    },
    openFilePicker() {
      document.getElementById("filePicker").click()
    }
  }
}
</script>


<style lang="css" scoped>
  @import url("style.css");
</style>