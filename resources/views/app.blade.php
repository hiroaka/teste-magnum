<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />


        <title inertia>{{ config('app.name', 'MCUNHA') }}</title>
        <meta name="csrf-token" content="">
        <!-- Fonts -->
        <link href="{{ asset('/css/app.css') }}" rel="stylesheet" />
        <!--     Fonts and icons     -->
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet" />
        <!-- Nucleo Icons -->
        <link href="/css/nucleo-icons.css" rel="stylesheet" />
        <link href="/css/nucleo-svg.css" rel="stylesheet" />
        <!-- Font Awesome Icons -->
        <script src="https://kit.fontawesome.com/3fe5ceda1e.js" crossorigin="anonymous"></script>
        {{-- <link href="/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css" rel="stylesheet"> --}}
        <link href="/css/nucleo-svg.css" rel="stylesheet" />
        <!-- CSS Files -->
        <link id="pagestyle" href="/css/argon-dashboard.css?v=2.0.0" rel="stylesheet" />
        <!-- Scripts -->
        @routes

    </head>
    <body class="font-sans antialiased">

        <script src="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js"></script>

        <script src="/js/argon-dashboard.min.js?v=2.0.0"></script>
    </body>
</html>
