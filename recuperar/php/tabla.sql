CREATE TABLE `restaurarClave` (
  `idLogin` int(11) NOT NULL,
  `codigo` varchar(45) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indices de la tabla `restaurarClave`
--
ALTER TABLE `restaurarClave`
  ADD PRIMARY KEY (`idLogin`);