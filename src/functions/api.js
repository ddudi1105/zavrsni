import axios from 'axios'

const getCarrier = (trackNum) => {
  return new Promise((resolve, reject) => {
    axios.post('/carriers/detect', {
      "tracking_number": trackNum.trim()
    })
      .then(response => {
        let carriers = response.data.data;
        //console.log(carriers);
        resolve(carriers);
      })
      .catch(err => {
        return err;
      });
  })
}

const postShipment = async (trackNum) => {
  const carriers = await getCarrier(trackNum);
  return new Promise((resolve, reject) => {
    if (carriers && carriers.length > 1) {
      resolve(carriers);
      return;
    } else if ((!carriers) || (carriers && carriers.length == 0)) {
      //console.log(carriers);
      resolve();
      return;
    }
    axios.post('/trackings/post', {
      "tracking_number": trackNum.trim(),
      "carrier_code": carriers[0].code
    })
      .then(response => {
        //console.log("post shipment", response);
        resolve(carriers[0]);
      })
      .catch(err => {
        //console.log(err);
        reject();
      });
  });
}

const getTracking = (carrierCode, trackNum) => {
  return new Promise((resolve, reject) => {
    axios.get(`/trackings/${carrierCode}/${trackNum.trim()}`)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject();
      });
  })
}

const trackPackage = async (trackNum) => {
  return new Promise(async (resolve, reject) => {
    const carrier = await postShipment(trackNum);
    
    if(!carrier || carrier == undefined) {
      resolve();
      return;
    }

    if (Array.isArray(carrier)) {
      //console.log('array')
      resolve(carrier);
      return;
    }

    let tracking = await getTracking(carrier.code, trackNum);

    if (tracking.data.data.status == 'pending') {
      setTimeout(() => {
        setTimeout(() => {
          getTracking(carrier.code, trackNum)
            .then(response => {
              let tracked = response.data.data;
              resolve(tracked);
            })
            .catch(err => {
              console.log(err);
              reject('error');
            });
        }, 1000);
      }, 6000);
      return;
    }

    resolve(tracking.data.data);
  })
}

const postWithCarrier = (carrierCode, trackNum) => {
  return new Promise((resolve, reject) => {
    axios.post('/trackings/post', {
      "tracking_number": trackNum.trim(),
      "carrier_code": carrierCode
    })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject();
      });
  });
}

const trackWithCarrier = async (carrierCode, trackNum) => {
  return new Promise(async (resolve, reject) => {
    await postWithCarrier(carrierCode, trackNum);
    const tracking = await getTracking(carrierCode, trackNum);
    //console.log(tracking);
    if (tracking.data.data.status == 'pending') {
      setTimeout(() => {
        setTimeout(() => {
          getTracking(carrierCode, trackNum)
            .then(res => {
              let tracked = res.data.data;
              resolve(tracked);
            });
        }, 1000);
      }, 6000);
      return;
    }

    //console.log(tracking.data.data);
    resolve(tracking.data.data);

    /* setTimeout(() => {
      getTracking(carrierCode)
        .then(res => {
          tracked = res.data.data;
          trackNum = '';
          carriersNames = [];
          carriersCodes = [];
          loadingSelect = false;
        });
    }, 0); */
  })
}

export {
  getCarrier,
  postShipment,
  trackPackage,
  postWithCarrier,
  trackWithCarrier
}