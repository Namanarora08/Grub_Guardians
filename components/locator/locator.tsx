"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapContainer, Marker, Popup, useMap, ImageOverlay } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { LocateFixed, Library } from "lucide-react"
import toast from "react-hot-toast"
import { mockHostels, getFreshnessAndRemainingTime, type FoodNotification } from "@/lib/mock-data"
import type { Hostel } from "@/lib/types"

// Extend Hostel type to include available leftovers
interface HostelWithLeftovers extends Hostel {
  availableLeftovers: FoodNotification[]
}

// Haversine formula to calculate distance between two lat/lng points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371 // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

// Custom Leaflet icon for all markers (user, default hostel, hovered hostel)
const createCustomIcon = (color: string) =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32px" height="32px"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/></svg>`,
    )}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })

const userIcon = createCustomIcon("#007bff") // blue for user location
const defaultHostelIcon = createCustomIcon("#34D399") // soft green for hostels
const hoveredHostelIcon = createCustomIcon("#FBBF24") // amber for hovered hostels

// Component to update map center
function ChangeMapView({ center }: { center: L.LatLngExpression }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, map.getZoom())
  }, [center, map])
  return null
}

interface LocatorProps {
  foodNotifications: FoodNotification[]
}

export function Locator({ foodNotifications }: LocatorProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<L.LatLngExpression>([30.3578, 76.3696]) // Default to Thapar University center
  const [hostelsWithDistance, setHostelsWithDistance] = useState<(HostelWithLeftovers & { distance: number })[]>([])
  const [searchAddress, setSearchAddress] = useState("") // Kept for future geocoding integration
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null)

  const mapRef = useRef<L.Map | null>(null)

  // Define map bounds for Thapar Campus based on the image
  const THAPAR_IMAGE_BOUNDS: L.LatLngBoundsExpression = [
    [30.35, 76.36], // South-West corner (approx. Hostel D/C area)
    [30.365, 76.378], // North-East corner (approx. TSLAS/Polytechnic area)
  ]

  // Library location for quick access
  const LIBRARY_LOCATION = { lat: 30.3585, lng: 76.371 }

  // Process hostels with available leftovers and calculate distances
  useEffect(() => {
    const activeFoodNotifications = foodNotifications.filter(
      (notif) => !notif.isClaimed && !getFreshnessAndRemainingTime(notif.createdAt).isExpired,
    )

    const hostelsWithActiveLeftovers: { [key: string]: HostelWithLeftovers } = {}
    mockHostels.forEach((hostel) => {
      hostelsWithActiveLeftovers[hostel.id] = { ...hostel, availableLeftovers: [] }
    })

    activeFoodNotifications.forEach((notif) => {
      // Match by hostel ID or hostel name
      const matchedHostel = mockHostels.find((h) => h.id === notif.sourceHostelId || h.name === notif.sourceHostelId)
      if (matchedHostel && hostelsWithActiveLeftovers[matchedHostel.id]) {
        hostelsWithActiveLeftovers[matchedHostel.id].availableLeftovers.push(notif)
      }
    })

    const filteredHostels = Object.values(hostelsWithActiveLeftovers).filter(
      (hostel) => hostel.availableLeftovers.length > 0,
    )

    if (userLocation) {
      const sortedHostels = filteredHostels
        .map((hostel) => ({
          ...hostel,
          distance: calculateDistance(userLocation.lat, userLocation.lng, hostel.lat, hostel.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
      setHostelsWithDistance(sortedHostels)
    } else {
      // If no user location, just show all hostels with leftovers without distance sorting
      setHostelsWithDistance(filteredHostels.map((h) => ({ ...h, distance: Number.POSITIVE_INFINITY })))
    }
  }, [userLocation, foodNotifications])

  const handleUseMyLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setMapCenter([latitude, longitude])
          toast.success("Location found!")
        },
        (error) => {
          console.error("Geolocation error:", error)
          toast.error("Could not retrieve your location. Please enable location services.")
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      )
    } else {
      toast.error("Geolocation is not supported by your browser.")
    }
  }, [])

  const handleSetLibraryLocation = useCallback(() => {
    setUserLocation(LIBRARY_LOCATION)
    setMapCenter([LIBRARY_LOCATION.lat, LIBRARY_LOCATION.lng])
    toast.success("Location set to Library!")
  }, [])

  const handleViewOnMap = useCallback((hostel: Hostel) => {
    setMapCenter([hostel.lat, hostel.lng])
    if (mapRef.current) {
      mapRef.current.setView([hostel.lat, hostel.lng], 15) // Zoom in when viewing on map
    }
  }, [])

  // Placeholder for address search (requires a geocoding service)
  const handleAddressSearch = useCallback(() => {
    if (searchAddress.trim() === "") {
      toast.error("Please enter an address.")
      return
    }
    toast.info("Address search is a placeholder. Use 'My Location' or 'Library' for now.")
  }, [searchAddress])

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-[calc(100vh-120px)]">
      {/* Map and Input Section (70% on desktop, full-width on mobile) */}
      <Card className="flex flex-col flex-1 md:w-7/12 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl">Hostel Food Map</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 p-0">
          <div className="flex gap-2 p-4">
            <Input
              type="text"
              placeholder="Enter address or hostel name"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="flex-1 bg-background/50 border-white/20 focus:ring-grubGreen-500"
            />
            <Button onClick={handleAddressSearch} className="bg-grubGreen-500 hover:bg-grubGreen-600">
              Search
            </Button>
            <Button
              onClick={handleUseMyLocation}
              variant="outline"
              size="icon"
              className="border-grubGreen-500 text-grubGreen-500 hover:bg-grubGreen-50 hover:text-grubGreen-600 bg-transparent"
            >
              <LocateFixed className="h-5 w-5" />
              <span className="sr-only">Use My Location</span>
            </Button>
            <Button
              onClick={handleSetLibraryLocation}
              variant="outline"
              size="icon"
              className="border-grubGreen-500 text-grubGreen-500 hover:bg-grubGreen-50 hover:text-grubGreen-600 bg-transparent"
            >
              <Library className="h-5 w-5" />
              <span className="sr-only">Set Location to Library</span>
            </Button>
          </div>
          <div className="flex-1 h-[500px] w-full z-0">
            <MapContainer
              center={mapCenter}
              zoom={14} // Adjusted zoom level for campus view
              scrollWheelZoom={true}
              className="h-full w-full rounded-b-2xl"
              whenCreated={(map) => (mapRef.current = map)}
              maxBounds={THAPAR_IMAGE_BOUNDS}
              minZoom={13} // Prevent zooming out too far from campus
              maxZoom={17} // Prevent zooming in too close
            >
              {/* Image Overlay for the campus map */}
              <ImageOverlay
                url="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1696175930573-uAJlSqIPSLYu76GZgr4Tb8dCWHmDE7.jpeg"
                bounds={THAPAR_IMAGE_BOUNDS}
                opacity={0.8} // Adjust opacity if needed
                zIndex={10}
              />

              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>Your Current Location</Popup>
                </Marker>
              )}
              {hostelsWithDistance.map((hostel) => (
                <Marker
                  key={hostel.id}
                  position={[hostel.lat, hostel.lng]}
                  icon={hoveredMarkerId === hostel.id ? hoveredHostelIcon : defaultHostelIcon} // Use simple icons
                  eventHandlers={{
                    mouseover: () => setHoveredMarkerId(hostel.id),
                    mouseout: () => setHoveredMarkerId(null),
                  }}
                >
                  <Popup>
                    <div className="font-semibold">{hostel.name}</div>
                    {userLocation && (
                      <div>
                        {hostel.distance !== Number.POSITIVE_INFINITY
                          ? `${hostel.distance.toFixed(2)} km away`
                          : "Distance N/A"}
                      </div>
                    )}
                    {hostel.availableLeftovers.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium">Available Leftovers:</p>
                        <ul className="list-disc pl-4 text-sm">
                          {hostel.availableLeftovers.map((food) => (
                            <li key={food.id}>{food.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Popup>
                </Marker>
              ))}
              <ChangeMapView center={mapCenter} />
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hostel List Section (30% on desktop, accordion below on mobile) */}
      <div className="md:w-5/12 w-full">
        <Card className="hidden md:block rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg h-full">
          <CardHeader>
            <CardTitle>Nearest Hostels with Leftovers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hostelsWithDistance.length > 0 ? (
              hostelsWithDistance.map((hostel) => (
                <div
                  key={hostel.id}
                  className="flex items-center justify-between border-b border-white/10 pb-2 last:border-b-0"
                >
                  <div>
                    <h3 className="font-semibold">{hostel.name}</h3>
                    {userLocation && (
                      <p className="text-sm text-muted-foreground">
                        {hostel.distance !== Number.POSITIVE_INFINITY
                          ? `${hostel.distance.toFixed(2)} km`
                          : "Distance N/A"}
                      </p>
                    )}
                    {hostel.availableLeftovers.length > 0 && (
                      <div className="mt-1">
                        <p className="text-xs font-medium text-muted-foreground">Leftovers:</p>
                        <ul className="list-disc pl-3 text-xs text-muted-foreground">
                          {hostel.availableLeftovers.map((food) => (
                            <li key={food.id}>{food.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOnMap(hostel)}
                    className="border-grubGreen-500 text-grubGreen-500 hover:bg-grubGreen-50 hover:text-grubGreen-600"
                  >
                    View on Map
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No hostels with active leftovers found.</p>
            )}
          </CardContent>
        </Card>

        {/* Mobile Accordion List */}
        <div className="md:hidden w-full">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="closest-hostels">
              <AccordionTrigger className="text-lg font-semibold">Nearest Hostels with Leftovers</AccordionTrigger>
              <AccordionContent>
                <Card className="rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-lg">
                  <CardContent className="space-y-4 p-4">
                    {hostelsWithDistance.length > 0 ? (
                      hostelsWithDistance.map((hostel) => (
                        <div
                          key={hostel.id}
                          className="flex items-center justify-between border-b border-white/10 pb-2 last:border-b-0"
                        >
                          <div>
                            <h3 className="font-semibold">{hostel.name}</h3>
                            {userLocation && (
                              <p className="text-sm text-muted-foreground">
                                {hostel.distance !== Number.POSITIVE_INFINITY
                                  ? `${hostel.distance.toFixed(2)} km`
                                  : "Distance N/A"}
                              </p>
                            )}
                            {hostel.availableLeftovers.length > 0 && (
                              <div className="mt-1">
                                <p className="text-xs font-medium text-muted-foreground">Leftovers:</p>
                                <ul className="list-disc pl-3 text-xs text-muted-foreground">
                                  {hostel.availableLeftovers.map((food) => (
                                    <li key={food.id}>{food.name}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOnMap(hostel)}
                            className="border-grubGreen-500 text-grubGreen-500 hover:bg-grubGreen-50 hover:text-grubGreen-600"
                          >
                            View on Map
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No hostels with active leftovers found.</p>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
