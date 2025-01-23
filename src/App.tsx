import React, { useState, useEffect, useMemo } from "react";
import { Location, useLocationsStore } from "./store/useLocationsStore";
import "./app.css"

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

  const getStore = async () => {
    await store.fetch()
  }

  useEffect(() => {
    getStore()
  }, [])

  useEffect(() => {
    if (store.isLoaded) setLocationsList(store.locations)
  }, [store.isLoaded, store.locations])

  return (
    <>
      <ul className="location-list">
        {locationsList.map((_location, index) => (
          <TestLocationForm key={`location-${index}`} index={index} />
        ))}
      </ul>

      <button
        type="button"
        className="add"
        onClick={() => {
          setLocationsList((locationsList) => [...locationsList, {}]);
        }}
      >
        <i className="fa-solid fa-plus" style={{ color: "#00aaff" }}></i>
        Добавить тестовую локацию
      </button>
    </>
  );
};

interface TestLocationFormProps {
  index: number;
}

const TestLocationForm: React.FC<TestLocationFormProps> = React.memo(({ index }) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [hint, setHint] = useState<string>('');
  const store = useLocationsStore();

  const serversList = useMemo(() => {
    if (!store.servers || !selectedLocation || !selectedServer) {
      return [];
    }

    return store.servers.filter(
      (server) =>
        server.environmentID === Number(selectedServer) &&
        server.locationID === Number(selectedLocation)
    );
  }, [store.servers, selectedLocation, selectedServer]);

  const changeLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value === "---" ? null : e.target.value);
  };

  const changeServer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServer(e.target.value === "---" ? null : e.target.value);
  };

  const log = () => {
    console.log('log', [{ locationID: selectedLocation, environmentID: selectedServer, hint: hint }])
  }

  if (!store.isLoaded) {
    return <div>Данные не загружены</div>;
  }

  return (
    <article className="location-container" onClick={log} >
      <header className="a">
        <i className="fa-solid fa-vial" />
        <h4>Тестовая локация {index + 1}</h4>
      </header>

      <button className="location-delete" aria-label={`Удалить тестовую локацию ${index + 1}`}>
        <i className="fa-solid fa-trash-can" style={{ color: "#e70808" }}></i>
      </button>

      <section className="settings">
        <label>Локация
          <div className="label-container" onClick={(e) => e.stopPropagation()}>
            <i className="fa-solid fa-location-dot" />
            <select onChange={changeLocation} value={selectedLocation || "-"}>
              <option value="-">-</option>
              {
                store.locations.map((loc) => (
                  <option key={loc.locationID} value={String(loc.locationID)}>{loc.name}</option>
                ))
              }
            </select>
          </div>
        </label>

        <label>Среда
          <div className="label-container" onClick={(e) => e.stopPropagation()}>
            <i className="fa-brands fa-envira" />
            <select onChange={changeServer} value={selectedServer || "-"}>
              <option value="-">-</option>
              {
                store.environments.map((env) => (
                  <option key={env.environmentID} value={String(env.environmentID)}>{env.name}</option>
                ))
              }
            </select>
          </div>
        </label>

        <label className="servers">Серверы
          <i className="fa-solid fa-server" />
          <ul>
            {
              serversList.map((server, ix) => (
                <li key={server.serverID}>{server.name}{serversList.length - 1 > ix ? ',' : null}</li>
              ))
            }
          </ul>
        </label>
      </section>

      <label>Подсказка
        <div className="label-container" onClick={(e) => e.stopPropagation()}>
          <i className="fa-solid fa-question" />
          <input
            placeholder="Комментарии к проекту"
            type="text"
            aria-label="Комментарии к проекту"
            onChange={(e) => setHint(e.target.value)}
          />
        </div>
      </label>
    </article>
  );
});