"use client"

import { useEffect, useRef } from "react"
import styles from "../styles/delivery-address.style.module.css"

const DEFAULT_LAT = 4.7109
const DEFAULT_LNG = -74.0721

interface DeliveryMapProps {
    onMarkerDrag: (lat: number, lng: number) => void
}

export function DeliveryMap({ onMarkerDrag }: DeliveryMapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const onMarkerDragRef = useRef(onMarkerDrag)

    useEffect(() => {
        onMarkerDragRef.current = onMarkerDrag
    }, [onMarkerDrag])

    useEffect(() => {
        let mapInstance: import("leaflet").Map | undefined
        let mounted = true

        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        async function initMap(lat: number, lng: number) {
            if (!mounted || !containerRef.current) return
            const L = (await import("leaflet")).default

            const icon = new L.Icon({
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41],
            })

            mapInstance = L.map(containerRef.current).setView([lat, lng], 15)

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(mapInstance)

            const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(mapInstance)
            onMarkerDragRef.current(lat, lng)

            marker.on("dragend", () => {
                const position = marker.getLatLng()
                onMarkerDragRef.current(position.lat, position.lng)
            })
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                void initMap(position.coords.latitude, position.coords.longitude)
            },
            () => {
                void initMap(DEFAULT_LAT, DEFAULT_LNG)
            }
        )

        return () => {
            mounted = false
            mapInstance?.remove()
            document.head.removeChild(link)
        }
    }, [])

    return (
        <div
            data-testid="delivery-map"
            ref={containerRef}
            className={styles.mapContainer}
        />
    )
}
