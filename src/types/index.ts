export type AppRole = "admin" | "agent" | "owner";

export type CertificationStatus = "conforme" | "non_conforme" | "en_attente" | "suspendu" | "n_existe_plus";
export type EstablishmentType = "boucherie" | "restaurant" | "usine" | "traiteur" | "produits_laitiers" | "produits_de_la_mer" | "epiceries" | "boulangeries" | "pharmacies" | "autre";

export interface Establishment {
    id: string;
    name: string;
    type: EstablishmentType;
    address: string;
    city: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    siret?: string;
    adnguardCode?: string;
    status: CertificationStatus;
    ownerId?: string;
    certifiedSince?: string;
    lastControlDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Control {
    id: string;
    establishmentId: string;
    agentId?: string;
    result: CertificationStatus;
    speciesAnalyzed: string[];
    speciesDetected: string[];
    anomaliesDetected?: string;
    notes?: string;
    controlDate: string;
    reportUrl?: string;
    reportId?: string;
    createdAt: string;
    updatedAt: string;
    establishment?: Establishment;
}

export interface Certification {
    id: string;
    establishmentId: string;
    validFrom: string;
    validUntil: string;
    qrCode: string;
    isActive: boolean;
    createdAt: string;
    establishment?: Establishment;
}
