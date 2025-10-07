import { usePlannerEvents } from "@/hooks/useEvents";

export default function PlannerPage() {
  const { data } = usePlannerEvents();

  return (
    <div>
      <h1>Kies een evenement of maak een nieuwe aan.</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {data?.map((event) => (
          <a
            key={event.id}
            href={`/planner/${event.id}`}
            className="block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-bold mb-2">{event.title}</h2>
            <p className="text-gray-600 mb-1">
              {new Date(event.startDate).toLocaleString()} -{" "}
              {new Date(event.endDate).toLocaleString()}
            </p>
            {event.location && (
              <p className="text-gray-600">Location: {event.location}</p>
            )}
          </a>
        ))}
        <a
          href={`/planner/new`}
          className="block p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-bold mb-2">Nieuw evenement</h2>
        </a>
      </div>
    </div>
  );
}
