import { useState, useEffect } from "react";
import { Location, useLocationsStore } from "./store/useLocationsStore";

export default function App() {
  return (
    <div className="App">
      <TestLocationsList />
    </div>
  );
}

const TestLocationsList = () => {
  const [locationsList, setLocationsList] = useState<Partial<Location>[]>([{}]);
  const store = useLocationsStore()
  console.log(locationsList)

  const getStore = async () => {
    await store.fetch()
  }

  const delItem = (ix: any) => {
    const newList = locationsList.filter((_item, index) => index !== ix)
    setLocationsList(newList)
  }

  useEffect(() => {
    getStore()
  }, [])

  useEffect(() => {
    if (store.isLoaded) setLocationsList(store.locations)
  }, [store])

  return (
    <>
      {locationsList.map((_location, index) => (
        <TestLocationForm key={`location-${index}`} index={index} del={delItem}/>
      ))}

      <button
        type="button"
        onClick={() => {
          setLocationsList((locationsList) => [...locationsList, {}]);
        }}
      >
        Добавить тестовую локацию
      </button>

      <button
        onClick={() => {
          console.log(locationsList);
        }}
      >
        Вывести результат в консоль
      </button>
    </>
  );
};

const TestLocationForm: React.FC<any> = ({ index, del }) => {
  const [selectedLocation, setSelectedLocation] = useState<any>()
  const [selectedServevr, setSelectedServer] = useState<any>()
  const [serversList, setServersList] = useState<any[]>([])
  const store = useLocationsStore();

  const changeServersList = (loc: string, env: string) => {
    if (!store.servers) return

    const listFiltered = store.servers.filter((server) => (
      server.environmentID == Number(env) && server.locationID == Number(loc)
    ))

    setServersList(listFiltered)
  }

  const changeLocation = (e: any) => {
    const value = e.target.value
    setSelectedLocation(value)
    changeServersList(value, selectedServevr)
  }

  const changeServer = (e: any) => {
    const value = e.target.value
    setSelectedServer(value)
    changeServersList(selectedLocation, value)
  }

  if (!store.isLoaded) {
    return <div>Данные не загружены</div>;
  }

  return (
    <div>
      <h4>Тестовая локация {index + 1}</h4>
      <button onClick={() => del(index)}>Удалить</button>

      <div>
        <label>Локация
          <select onChange={changeLocation}>
            <option value="---">-</option>
            {
              store.locations.map((loc) => (
                <option key={loc.locationID} value={loc.locationID}>{loc.name}</option>
              ))
            }
          </select>
        </label>

        <label>Среда
          <select onChange={changeServer}>
            <option value="---">-</option>
            {
              store.environments.map((env) => (
                <option key={env.environmentID} value={env.environmentID}>{env.name}</option>
              ))
            }
          </select>
        </label>

        <label>Серверы
          <ul>
            {
              serversList.map((server) => <li key={server.serverID}>{server.name}</li>)
            }
          </ul>
        </label>
      </div>

      <label>Подсказка
        <input type="Комментарий по локации" />
      </label>
    </div>
  );
};