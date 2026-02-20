<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity]
#[ApiResource(
    normalizationContext: ['groups' => ['appointment:read']],
    denormalizationContext: ['groups' => ['appointment:write']]
)]
#[ApiFilter(SearchFilter::class, properties: ['patient' => 'exact'])]
class Appointment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['appointment:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?Patient $patient = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?Staff $staff = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?\DateTimeInterface $appointmentDate = null;

    #[ORM\Column(length: 50)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?string $status = 'pending';

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?string $notes = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $googleCalendarId = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['appointment:read'])]
    private ?string $notesIa = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['appointment:read', 'appointment:write'])]
    private ?MedicalService $service = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): static
    {
        $this->patient = $patient;

        return $this;
    }

    public function getStaff(): ?Staff
    {
        return $this->staff;
    }

    public function setStaff(?Staff $staff): static
    {
        $this->staff = $staff;

        return $this;
    }

    public function getAppointmentDate(): ?\DateTimeInterface
    {
        return $this->appointmentDate;
    }

    public function setAppointmentDate(\DateTimeInterface $appointmentDate): static
    {
        $this->appointmentDate = $appointmentDate;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getNotes(): ?string
    {
        return $this->notes;
    }

    public function setNotes(?string $notes): static
    {
        $this->notes = $notes;

        return $this;
    }

    public function getGoogleCalendarId(): ?string
    {
        return $this->googleCalendarId;
    }

    public function setGoogleCalendarId(?string $googleCalendarId): static
    {
        $this->googleCalendarId = $googleCalendarId;

        return $this;
    }

    public function getNotesIa(): ?string
    {
        return $this->notesIa;
    }

    public function setNotesIa(?string $notesIa): static
    {
        $this->notesIa = $notesIa;

        return $this;
    }

    public function getService(): ?MedicalService
    {
        return $this->service;
    }

    public function setService(?MedicalService $service): static
    {
        $this->service = $service;

        return $this;
    }
}
