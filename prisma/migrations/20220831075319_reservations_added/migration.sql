-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hotel" TEXT,
    "tour" TEXT,
    "transportFrom" TEXT,
    "transportTo" TEXT,
    "phone" TEXT,
    "rsvpDate" TIMESTAMP(3) NOT NULL,
    "rsvpTime" TEXT NOT NULL,
    "numAdults" INTEGER NOT NULL,
    "numKids" INTEGER NOT NULL,
    "reservedBy" TEXT,
    "roomNum" TEXT,
    "details" TEXT,
    "deposit" TEXT,
    "totalPrice" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);
