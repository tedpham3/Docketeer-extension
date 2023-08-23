// @ts-noCheck
import {
  filterOneProperty,
  listOfVolumeProperties,
} from './volumeHistoryHelper';
import { useMemo } from 'react';
import useSurvey from './dispatch';
import { useAppSelector } from '../reducers/hooks';
import { createDockerDesktopClient } from '@docker/extension-api-client';
/**
 * @module | commands.tsx
 * @description | Organizes all server-communication throughout client-side into a single custom hook exportable into individual components
 **/
const ddClient = createDockerDesktopClient();
const useHelper = () => {
  const dispatch = useSurvey();

  const state = useAppSelector((state) => state);

  const actions = useMemo(
    () => ({
      /*
      // funcs to help w/ creating new users
      createNewUser(username: string, password: string) {
        fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        })
          .then(() => {
            actions.getUpdatedUserList();
          })
          .catch((err) => {
            console.log(err);
          });
      },
      checkCookie(): Promise<string> {
        return fetch('/api/login/checkCookie', {
          method: 'GET',
        })
          .then((res) => res)
          .then((data) => {
            return data;
          })
          .catch((error) => {
            console.log('error when fetching cookie', error);
          });
      },
      */
      /*
      // Kubernetes | gets the key and uid of the grafana dashboard that is forwarded to localhost:3000
      getUid(apiKey: string, dashboard: string): Promise<string> {
        const { refreshRunningContainers } = dispatch;
        ddClient.extension.vm?.service?.post('/gapi/uidkey', {
            key: apiKey,
            dashboard: dashboard,
          })
          .then((data) => {
            console.log('Response received:', data);
            return data;
          })
          .catch((err: Error): void => console.log(err));
      },
      getKey(): Promise<string> {
        return ddClient.extension.vm?.service?.get('/gapi/key')
          .then((data) => {
            console.log('data', data)
            return data;
          })
          .catch((error) => {
            console.log('Error when fetching api key', error);
          });
      },
      */
      /* Refreshes running containers */
      refreshRunning() {
        const { refreshRunningContainers } = dispatch;
        ddClient.extension.vm?.service?.get('/command/refreshRunning')
          .then((data: Response) => data)
          .then((runningContainers) => {
            refreshRunningContainers(runningContainers);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Refreshes stopped containers */
      refreshStopped() {
        const { refreshStoppedContainers } = dispatch;
        ddClient.extension.vm?.service?.get('/command/refreshStopped')
          .then((data: Response) => data)
          .then((stoppedContainers) => {
            refreshStoppedContainers(stoppedContainers);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Refreshes images */
      refreshImages() {
        const { refreshImagesList } = dispatch;
        ddClient.extension.vm?.service?.get('/command/refreshImages')
          .then((data: Response) => data)
          .then((imagesList) => {
            refreshImagesList(imagesList);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Refreshes networkContainerList[state in networkReducer] */
      refreshNetwork() {
        const { refreshNetworkList } = dispatch;
        ddClient.extension.vm?.service?.get('/command/networkListContainers')
          .then((data: Response) => data)
          .then((networkList) => {
            refreshNetworkList(networkList);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Removes stopped containers @param {*} containerID */
      remove(containerID: string) {
        const { removeContainer } = dispatch;
        ddClient.extension.vm?.service?.delete(`/command/removeContainer?id=${containerID}`)
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((message) => {
            console.log({ message });
            removeContainer(containerID);
          })
          .catch((err) => console.log(err));
      },
      /* Stops a container on what user selects @param {*} id */
      stop(id) {
        const { stopRunningContainer } = dispatch;
        ddClient.extension.vm?.service?.delete(`/command/stopContainer?id=${id}`, {
          method: 'DELETE',
        })
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((message) => {
            console.log({ message });
            stopRunningContainer(id);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Starts a stopped container in containers tab @param {*} id */
      runStopped(id: string) {
        const { runStoppedContainer } = dispatch;
        ddClient.extension.vm?.service?.get(`/command/runStopped?id=${id}`)
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((message) => {
            console.log({ message });
            runStoppedContainer(id);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Runs an image from the pulled images list in image tab @param {*} container */
      runIm(container) {
        const { refreshRunningContainers } = dispatch;
        ddClient.extension.vm?.service?.post('/command/runImage', container)
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((newRunningList) => {
            // With the deletion of getApiData from /runImage endpoint — the client is now given res.locals.containers rather than res.locals.apiData — ensure that this is fine anywhere where runningList is extracted from the containerReducer
            refreshRunningContainers(newRunningList);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Removes an image from pulled images list in image tab @param {*} id */

      removeIm(id) {
        const { refreshImages } = dispatch;
        ddClient.extension.vm?.service?.delete(`/command/removeImage?id=${id}`)
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            }
          })
          .then(() => {
            refreshImages().catch((err: Error): void => console.log(err));
          });
      },
      /* Handles System Prune @param {*} e */
      handlePruneClick(e) {
        e.preventDefault();
        ddClient.extension.vm?.service?.delete('/command/dockerPrune')
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            }
          })
          .catch((err: Error): void => console.log(err));
      },

      /* Handles Network Prune @param {*} e */
      handleNetworkPruneClick(e) {
        e.preventDefault();
        ddClient.extension.vm?.service?.delete('/command/dockerNetworkPrune')
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            }
          })
          .catch((err: Error): void => console.log(err));
      },
      
      /* Pulls image based on the repo you select @param {*} repo */
      pullImage(repo) {
        ddClient.extension.vm?.service?.get(`/command/pullImage?repo=${repo}`)
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((message) => {
            console.log({ message });
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Display all containers network based on docker-compose when the application starts */
      networkContainers() {
        // Pass in container that button is clicked on
        const { getNetworkContainers } = dispatch;
        ddClient.extension.vm?.service?.get('/command/networkContainers')
          .then((data: Response) => data)
          .then((networkContainers) => {
            // grab the name of the network only using map method
            networkContainers = networkContainers.map((el) => el.Name);
            getNetworkContainers(networkContainers); // use passed in container to
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Compose up a docker container network @param {*} filePath @param {*} ymlFileName */
      dockerComposeUp(filePath, ymlFileName) {
        const { getContainerStacks } = dispatch;
        ddClient.extension.vm?.service?.post('/command/composeUp', {
            filePath: filePath,
            ymlFileName: ymlFileName,
          })
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((dockerOutput) => {
            getContainerStacks(dockerOutput);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Get list of running container networks */
      dockerComposeStacks() {
        const { getContainerStacks } = dispatch;
        ddClient.extension.vm?.service?.get('/command/composeStacks')
          .then((data: Response) => data)
          .then((dockerOutput) => {
            getContainerStacks(dockerOutput);
          })
          .catch((err: Error): void => console.log(err));
      },
      /* Compose down selected container network @param {*} filePath @param {*} ymlFileName */
      dockerComposeDown(filePath, ymlFileName) {
        const { getContainerStacks } = dispatch;
        ddClient.extension.vm?.service?.post('/command/composeDown', {
            filePath: filePath,
            ymlFileName: ymlFileName,
          })
          .then((message) => {
            if (message.status === 401) {
              window.alert('Invalid permissions');
              throw new Error(message);
            } else {
              return message;
            }
          })
          .then((dockerOutput) => {
            getContainerStacks(dockerOutput);
          })
          .catch((err: Error): void => console.log(err));
      },
      /*
      // These commands were created but the only one called is writeToDb in SharedLayout.tsx

      // Writes metric stats into database
      writeToDb() {
        const interval = 150000;
        setInterval(() => {
          const runningContainers = state.containers.runningList;

          const stoppedContainers = state.containers.stoppedList;

          if (!runningContainers.length) return;
          const containerParameters: object = {};

          runningContainers.forEach((container: RunningListType) => {
            containerParameters[container.Name] = {
              ID: container.ID,
              names: container.Name,
              Image: container.Image,
              cpu: container.CPUPerc,
              mem: container.MemPerc,
              memuse: container.MemUsage,
              net: container.NetIO,
              block: container.BlockIO,
              pid: container.PIDs,
              timestamp: 'current_timestamp',
            };
          });
          if (stoppedContainers.length >= 1) {
            stoppedContainers.forEach((container) => {
              containerParameters[container.Names] = {
                ID: container.ID,
                names: container.Names,
                cpu: '0.00%',
                mem: '0.00%',
                memuse: '0.00MiB/0.00MiB',
                net: '0.00kB/0.00kB',
                block: '0.00kB/0.00kB',
                pid: '0',
                timestamp: 'current_timestamp',
              };
            });
          }
          ddClient.extension.vm?.service?.post('/api/init/addMetrics', {
            containers: (object = containerParameters)
          }).catch((err: Error): void => {
            console.log(err);
          });
        }, interval);
      },
      setDbSessionTimeZone() {
        const currentTime = new Date();
        const offsetTimeZoneInHours = currentTime.getTimezoneOffset() / 60;
        const ddClient = createDockerDesktopClient();
        ddClient.extension.vm?.service?.post('/init/timezone', {timezone: offsetTimeZoneInHours})
          .then((data: Response) => data)
          .then((response) => {
            console.log(response);
            return;
          })
          .catch((err: Error): void => {
            console.log(err);
          });
      },
      async getContainerGitUrl(container) {
        const response: Response = await ddClient.extension.vm?.service?.post('/init/github', { githubUrl: container })
        return response;
      },
      */
      /* Docker command to retrieve the list of running volumes */
      getAllDockerVolumes() {
        const { getVolumes } = dispatch;
        ddClient.extension.vm?.service?.get('/command/allDockerVolumes')
          .then((volumes: Response) => volumes)
          .then((dockerVolumes) => {
            return getVolumes(filterOneProperty(dockerVolumes, 'Name'));
          })
          .catch((err: Error): void => {
            console.log(err);
          });
      },
      /* Docker command to retrieve the list of containers running in specified volume @param {string} volumeName */
      getVolumeContainers(volumeName) {
        const { getVolumeContainerList } = dispatch;
        ddClient.extension.vm?.service?.get(`/command/volumeContainers?volumeName=${volumeName}`)
          .then((data: Response) => data)
          .then((volumeContainers) => {
            return getVolumeContainerList(
              listOfVolumeProperties(volumeName, volumeContainers)
            );
          })
          .catch((err: Error): void => {
            console.log(err);
          });
      },


      /* Builds and child_process.executes a docker logs command to generate logs @param {object} optionsObj @returns {object} containerLogs */
      async getLogs(optionsObj) {
        try {
          const response: Response = await ddClient.extension.vm?.service?.post('/command/allLogs', optionsObj)
          const parsedResponse = response;
          return parsedResponse;
        } catch {
          console.log(err);
        }
      },

      async checkGrafanaConnection() {
        try {
          const response: Response = await fetch('http://localhost:2999/')
          return (response.status === 200);
        } catch (error) {
          console.log('Error occured when in commands.tsx checkGrafanaConnection:');
          Object.entries(error).forEach(el => console.log(el));
        }
        }
    }),
    [dispatch]
  );
  return actions;
};

export default useHelper;